import { Controller, Get, Post, Body } from '@nestjs/common';

import { AppService } from './app.service';
import { CreateUserDto } from './create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post()
  createUser(@Body() payload: CreateUserDto) {
    return payload;
  }
}
