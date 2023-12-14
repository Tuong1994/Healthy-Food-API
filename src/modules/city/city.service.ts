import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { City } from '@prisma/client';
import { CityDto } from './city.dto';
import helper from 'src/helper';
import utils from 'src/utils';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async getCities(query: QueryDto) {
    const { keywords, sortBy, langCode } = query;
    const cities = await this.prisma.city.findMany({
      where: { langCode },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) return cities.filter((city) => city.name.toLowerCase().includes(keywords.toLowerCase()));
    return cities;
  }

  async getCitiesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode } = query;
    let collection: Paging<City> = utils.defaultCollection();
    const cities = await this.prisma.city.findMany({
      where: { langCode },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) {
      const filterCities = cities.filter((city) => city.name.toLowerCase().includes(keywords.toLowerCase()));
      collection = utils.paging<City>(filterCities, page, limit);
    } else collection = utils.paging<City>(cities, page, limit);

    return collection;
  }

  async getCity(query: QueryDto) {
    const { cityId } = query;
    const city = await this.prisma.city.findUnique({ where: { id: cityId } });
    return city;
  }

  async createCity(city: CityDto) {
    const { name, code, langCode } = city;
    const newCity = await this.prisma.city.create({ data: { name, code, langCode } });
    return newCity;
  }

  async updateCity(query: QueryDto, city: CityDto) {
    const { cityId } = query;
    const { name, code, langCode } = city;
    await this.prisma.city.update({ where: { id: cityId }, data: { name, code, langCode } });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeCities(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const cities = await this.prisma.city.findMany({ where: { id: { in: listIds } } });
    if (cities && cities.length > 0) {
      await this.prisma.city.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('City not found', HttpStatus.NOT_FOUND);
  }
}
