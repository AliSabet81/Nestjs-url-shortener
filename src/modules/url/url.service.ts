import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GetUrlsDto } from './dto/get-urls.dto';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UidService } from '../../services/uid/uid.service';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UrlService {
  private host: string;

  constructor(
    private readonly uidService: UidService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.host = this.configService.getOrThrow<string>(`host`);
  }

  async create(createUrlDto: CreateUrlDto) {
    const uid = this.uidService.generate(10);
    const url = await this.databaseService.url.create({
      data: {
        ...createUrlDto,
        url: `${this.host}/${uid}`,
      },
    });
    return url;
  }

  async findAll({ filter, page = 1, limit = 10 }: GetUrlsDto) {
    const whereClause: Prisma.UrlWhereInput = filter
      ? {
          OR: [
            { title: { contains: filter } },
            { redirect: { contains: filter } },
            { description: { contains: filter } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;
    const take = limit;

    const data = await this.databaseService.url.findMany({
      where: whereClause,
      skip,
      take,
    });

    const total = await this.databaseService.url.count({
      where: whereClause,
    });

    let baseUrl = `${this.host}?limit=${limit}`;
    if (filter) {
      baseUrl += `&filter=${encodeURIComponent(filter)}`;
    }

    const totalPages = Math.ceil(total / limit);
    const nextPage = page < totalPages ? `${baseUrl}&page=${page + 1}` : null;
    const previousPage = page > 1 ? `${baseUrl}&page=${page - 1}` : null;

    const meta = {
      currentPage: page,
      perPage: limit,
      total,
      totalPages,
      nextPage,
      previousPage,
    };

    return {
      data,
      meta,
    };
  }

  async findOne(url: string) {
    return await this.databaseService.url.findUnique({
      where: {
        url: `${this.host}/${url}`,
      },
    });
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    return await this.databaseService.url.update({
      where: {
        id,
      },
      data: updateUrlDto,
    });
  }

  async remove(id: number) {
    return await this.databaseService.url.delete({
      where: {
        id,
      },
    });
  }
}
