import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { ELang, ERole } from 'src/common/enum/base';
import { UserAddress } from '@prisma/client';
import { UserResponse } from './user.type';
import { UserDto } from 'src/modules/user/user.dto';
import { UserHelper } from './user.helper';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { CREATE_ERROR, UPDATE_SUCCESS, REMOVE_SUCCESS, RESTORE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private userHelper: UserHelper,
  ) {}

  async getUsers(query: QueryDto) {
    const { page, limit, langCode, keywords, sortBy, gender, role, staffOnly } = query;
    let collection: Paging<UserResponse> = utils.defaultCollection();
    const users = await this.prisma.user.findMany({
      where: {
        AND: [
          { gender: gender && Number(gender) },
          {
            role: staffOnly
              ? { not: ERole.CUSTOMER, in: role ? [Number(role)] : undefined }
              : role && Number(role),
          },
          { isDelete: { equals: false } },
        ],
      },
      select: {
        ...this.userHelper.getSelectFields(),
        address: { select: { ...this.userHelper.getSelectAddressFields(langCode) } },
        image: { select: { id: true, path: true, size: true, publicId: true } },
      },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) {
      const filterUsers = users.filter(
        (user) =>
          utils.filterByKeywords(user.firstName, keywords) ||
          utils.filterByKeywords(user.lastName, keywords) ||
          utils.filterByKeywords(user.fullName, keywords) ||
          utils.filterByKeywords(user.phone, keywords) ||
          utils.filterByKeywords(user.email, keywords),
      );
      collection = utils.paging<UserResponse>(filterUsers, page, limit);
    } else collection = utils.paging<UserResponse>(users, page, limit);
    const items = this.userHelper.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getUser(query: QueryDto) {
    const { userId, langCode } = query;
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isDelete: { equals: false } },
      select: {
        ...this.userHelper.getSelectFields(),
        address: { select: { ...this.userHelper.getSelectAddressFields(langCode) } },
        image: { select: { id: true, path: true, size: true, publicId: true } },
      },
    });
    return {
      ...user,
      address: user.address
        ? {
            addressEn: user.address.addressEn,
            addressVn: user.address.addressVn,
            ...this.userHelper.convertAddress(user.address, langCode),
          }
        : null,
    };
  }

  async createUser(query: QueryDto, file: Express.Multer.File, user: UserDto) {
    const { langCode } = query;
    const { email, password, role, firstName, lastName, phone, gender, birthday, address } = user;

    const fullName = this.userHelper.getFullName(firstName, lastName, langCode);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: utils.bcryptHash(password),
        firstName,
        lastName,
        fullName,
        phone,
        birthday,
        role: role && Number(role),
        gender: gender && Number(gender),
        isDelete: false,
      },
      include: {
        address: true,
        image: true,
      },
    });

    if (newUser) {
      let responseUser: any;
      if (newUser.role !== ERole.CUSTOMER) {
        await this.prisma.userPermission.create({
          data: {
            create: false,
            update: false,
            remove: false,
            isDelete: false,
            userId: newUser.id,
          },
        });
      }
      if (address) {
        const addressJson = utils.parseJSON<UserAddress>(address);
        const { addressEn, addressVn, cityCode, districtCode, wardCode } = addressJson;
        const fullAddressEn = await this.userHelper.getFullAddress(
          addressEn,
          Number(cityCode),
          Number(districtCode),
          Number(wardCode),
          ELang.EN,
        );
        const fullAddressVn = await this.userHelper.getFullAddress(
          addressEn,
          Number(cityCode),
          Number(districtCode),
          Number(wardCode),
          ELang.VN,
        );
        await this.prisma.userAddress.create({
          data: {
            addressEn,
            addressVn,
            fullAddressEn,
            fullAddressVn,
            cityCode: cityCode && Number(cityCode),
            districtCode: districtCode && Number(districtCode),
            wardCode: wardCode && Number(wardCode),
            userId: newUser.id,
            isDelete: false,
          },
        });
        responseUser = await this.prisma.user.findUnique({
          where: { id: newUser.id },
          include: { address: true },
        });
      }

      if (file) {
        const result = await this.cloudinary.upload(utils.getFileUrl(file));
        const image = utils.generateImage(result, { userId: newUser.id });
        await this.prisma.image.create({ data: { ...image, isDelete: false } });
        responseUser = await this.prisma.user.findUnique({
          where: { id: newUser.id },
          include: { address: true, image: true },
        });
      }
      return responseUser ? responseUser : newUser;
    }
    throw new HttpException(CREATE_ERROR, HttpStatus.BAD_REQUEST);
  }

  async updateUser(query: QueryDto, file: Express.Multer.File, user: UserDto) {
    const { userId, langCode } = query;
    const { role, firstName, lastName, phone, gender, birthday, address } = user;

    const fullName = this.userHelper.getFullName(firstName, lastName, langCode);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        fullName,
        phone,
        birthday,
        gender: gender && Number(gender),
        role: role && Number(role),
      },
    });

    if (address) {
      const addressJson = utils.parseJSON<UserAddress>(address);
      const { addressEn, addressVn, cityCode, districtCode, wardCode } = addressJson;
      const fullAddressEn = await this.userHelper.getFullAddress(
        addressEn,
        Number(cityCode),
        Number(districtCode),
        Number(wardCode),
        ELang.EN,
      );
      const fullAddressVn = await this.userHelper.getFullAddress(
        addressVn,
        Number(cityCode),
        Number(districtCode),
        Number(wardCode),
        ELang.VN,
      );
      const userAddress = await this.prisma.userAddress.findUnique({ where: { userId } });
      const data = {
        addressEn,
        addressVn,
        fullAddressEn,
        fullAddressVn,
        userId,
        isDelete: false,
        cityCode: cityCode && Number(cityCode),
        districtCode: districtCode && Number(districtCode),
        wardCode: wardCode && Number(wardCode),
      };
      if (!userAddress) {
        await this.prisma.userAddress.create({ data });
      } else {
        await this.prisma.userAddress.update({
          where: { userId },
          data,
        });
      }
    }

    if (file) {
      const updateUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { image: true },
      });
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { userId });
      if (updateUser.image) {
        await this.cloudinary.destroy(updateUser.image.publicId);
        await this.prisma.image.update({ where: { userId }, data: image });
      } else {
        await this.prisma.image.create({ data: { ...image, isDelete: false } });
      }
    }

    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeUsers(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const users = await this.prisma.user.findMany({
      where: { id: { in: listIds } },
      select: { id: true, image: true, address: true, comments: true, rates: true, likes: true },
    });
    if (users && !users.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.user.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      users.map(async (user) => {
        if (user.image) await this.userHelper.handleUpdateIsDeleteUserImage(user, true);
        if (user.address) await this.userHelper.handleUpdateIsDeleteUserAddress(user, true);
        if (user.comments.length > 0) await this.userHelper.handleUpdateIsDeleteUserComments(user, true);
        if (user.rates.length > 0) await this.userHelper.handleUpdateIsDeleteUserRates(user, true);
        if (user.likes.length > 0) await this.userHelper.handleUpdateIsDeleteUserLikes(user, true);
      }),
    );
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeAddress(query: QueryDto) {
    const { userId } = query;
    const address = await this.prisma.userAddress.findUnique({ where: { userId } });
    if (!address) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.userAddress.delete({ where: { userId } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeUsersPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const users = await this.prisma.user.findMany({
      where: { id: { in: listIds } },
      include: { image: true },
    });
    if (users && !users.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.user.deleteMany({ where: { id: { in: listIds } } });
    await Promise.all(
      users.map(async (user) => {
        if (!user.image) return;
        await this.cloudinary.destroy(user.image.publicId);
      }),
    );
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreUsers() {
    const users = await this.prisma.user.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, address: true, image: true, comments: true, rates: true, likes: true },
    });
    if (users && !users.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      users.map(async (user) => {
        await this.userHelper.handleRestoreUser(user);
        if (user.image) await this.userHelper.handleUpdateIsDeleteUserImage(user, false);
        if (user.address) await this.userHelper.handleUpdateIsDeleteUserAddress(user, false);
        if (user.comments.length > 0) await this.userHelper.handleUpdateIsDeleteUserComments(user, false);
        if (user.rates.length > 0) await this.userHelper.handleUpdateIsDeleteUserRates(user, false);
        if (user.likes.length > 0) await this.userHelper.handleUpdateIsDeleteUserLikes(user, false);
      }),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
