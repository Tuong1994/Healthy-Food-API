import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { City } from '@prisma/client';
import { CityDto } from './city.dto';
import { CityHelper } from './city.helper';
import { ELang } from 'src/common/enum/base';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const {UPDATE_SUCCESS, REMOVE_SUCCESS, RESTORE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE} = responseMessage

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService, private cityHelper: CityHelper) {}

  async getCities(query: QueryDto) {
    const { keywords, sortBy, langCode } = query;
    const cities = await this.prisma.city.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.cityHelper.getSelectFields(langCode) },
    });
    let filterCities: City[] = [];
    if (keywords)
      return cities.filter((city) =>
        langCode === ELang.EN
          ? utils.filterByKeywords(city.nameEn, keywords)
          : utils.filterByKeywords(city.nameVn, keywords),
      );
    const items = this.cityHelper.convertCollection(keywords ? filterCities : cities, langCode);
    return { totalItems: keywords ? filterCities.length : cities.length, items };
  }

  async getCitiesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode } = query;
    let collection: Paging<City> = utils.defaultCollection();
    const cities = await this.prisma.city.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.cityHelper.getSelectFields(langCode) },
    });
    if (keywords) {
      const filterCities = cities.filter((city) =>
        langCode === ELang.EN
          ? utils.filterByKeywords(city.nameEn, keywords)
          : utils.filterByKeywords(city.nameVn, keywords),
      );
      collection = utils.paging<City>(filterCities, page, limit);
    } else collection = utils.paging<City>(cities, page, limit);
    const items = this.cityHelper.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getCity(query: QueryDto) {
    const { cityId, langCode } = query;
    const city = await this.prisma.city.findUnique({
      where: { id: cityId, isDelete: { equals: false } },
      select: { ...this.cityHelper.getSelectFields(langCode) },
    });
    return utils.convertRecordsName<City>(city, langCode);
  }

  async createCity(city: CityDto) {
    const { nameEn, nameVn, code } = city;
    const newCity = await this.prisma.city.create({
      data: { nameEn, nameVn, code, isDelete: false },
    });
    return newCity;
  }

  async updateCity(query: QueryDto, city: CityDto) {
    const { cityId } = query;
    const { nameEn, nameVn, code } = city;
    await this.prisma.city.update({ where: { id: cityId }, data: { nameEn, nameVn, code } });
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeCities(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const cities = await this.prisma.city.findMany({ where: { id: { in: listIds } } });
    if (cities && !cities.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.city.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeCitiesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const cities = await this.prisma.city.findMany({ where: { id: { in: listIds } } });
    if (cities && !cities.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.city.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreCities() {
    const cities = await this.prisma.city.findMany({ where: { isDelete: { equals: true } } });
    if (cities && !cities.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      cities.map(async (city) => {
        await this.prisma.city.update({ where: { id: city.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
