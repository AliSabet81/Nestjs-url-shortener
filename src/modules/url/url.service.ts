import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  findAll() {
    return `This action returns all url`;
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
