import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { City } from '@prisma/client';
import { CityDto } from './city.dto';
import { ELang } from 'src/common/enum/base';
import helper from 'src/helper';
import utils from 'src/utils';

const getSelectFields = (langCode: ELang) => ({
  id: true,
  nameEn: langCode === ELang.EN,
  nameVn: langCode === ELang.VN,
  code: true,
  isDelete: true,
  createdAt: true,
  updatedAt: true,
});

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async getCities(query: QueryDto) {
    const { keywords, sortBy, langCode } = query;
    const cities = await this.prisma.city.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      select: { ...getSelectFields(langCode) },
    });
    if (keywords)
      return cities.filter(
        (city) =>
          city.nameEn.toLowerCase().includes(keywords.toLowerCase()) ||
          city.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
    return cities;
  }

  async getCitiesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode } = query;
    let collection: Paging<City> = utils.defaultCollection();
    const cities = await this.prisma.city.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      select: { ...getSelectFields(langCode) },
    });
    if (keywords) {
      const filterCities = cities.filter(
        (city) =>
          city.nameEn.toLowerCase().includes(keywords.toLowerCase()) ||
          city.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<City>(filterCities, page, limit);
    } else collection = utils.paging<City>(cities, page, limit);

    return collection;
  }

  async getCity(query: QueryDto) {
    const { cityId, langCode } = query;
    const city = await this.prisma.city.findUnique({
      where: { id: cityId, isDelete: { equals: false } },
      select: { ...getSelectFields(langCode) },
    });
    return city;
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
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeCities(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const cities = await this.prisma.city.findMany({ where: { id: { in: listIds } } });
    if (cities && cities.length > 0) {
      await this.prisma.city.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('City not found', HttpStatus.NOT_FOUND);
  }

  async removeCitiesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const cities = await this.prisma.city.findMany({ where: { id: { in: listIds } } });
    if (cities && cities.length > 0) {
      await this.prisma.city.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('City not found', HttpStatus.NOT_FOUND);
  }

  async restoreCities() {
    await this.prisma.city.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
