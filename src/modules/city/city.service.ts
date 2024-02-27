import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { City } from '@prisma/client';
import { CityDto } from './city.dto';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  private getSelectFields(langCode: ELang) {
    return {
      id: true,
      nameEn: langCode === ELang.EN,
      nameVn: langCode === ELang.VN,
      code: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  private convertCollection(cities: City[], langCode: ELang) {
    return cities.map((city) => ({
      ...utils.convertRecordsName<City>(city, langCode),
    }));
  }

  async getCities(query: QueryDto) {
    const { keywords, sortBy, langCode } = query;
    const cities = await this.prisma.city.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.getSelectFields(langCode) },
    });
    let filterCities: City[] = [];
    if (keywords)
      return cities.filter((city) =>
        langCode === ELang.EN
          ? city.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : city.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
    const items = this.convertCollection(keywords ? filterCities : cities, langCode);
    return { totalItems: keywords ? filterCities.length : cities.length, items };
  }

  async getCitiesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode } = query;
    let collection: Paging<City> = utils.defaultCollection();
    const cities = await this.prisma.city.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.getSelectFields(langCode) },
    });
    if (keywords) {
      const filterCities = cities.filter((city) =>
        langCode === ELang.EN
          ? city.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : city.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<City>(filterCities, page, limit);
    } else collection = utils.paging<City>(cities, page, limit);
    const items = this.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getCity(query: QueryDto) {
    const { cityId, langCode } = query;
    const city = await this.prisma.city.findUnique({
      where: { id: cityId, isDelete: { equals: false } },
      select: { ...this.getSelectFields(langCode) },
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
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeCities(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const cities = await this.prisma.city.findMany({ where: { id: { in: listIds } } });
    if (cities && !cities.length) throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    await this.prisma.city.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeCitiesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const cities = await this.prisma.city.findMany({ where: { id: { in: listIds } } });
    if (cities && !cities.length) throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    await this.prisma.city.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreCities() {
    const cities = await this.prisma.city.findMany({ where: { isDelete: { equals: true } } });
    if (cities && !cities.length) throw new HttpException('There are no data restored', HttpStatus.OK);
    await Promise.all(
      cities.map(async (city) => {
        await this.prisma.city.update({ where: { id: city.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
