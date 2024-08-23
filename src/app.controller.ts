import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './res/common/guards/jwt-auth.guard';

@ApiTags("Main")
@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('unauth')
  async getDefaultMainPage() {
    return this.appService.getDefaultMainPage();
  }

  @UseGuards(JwtAuthGuard)
  @Get('authed')
  async getUserMainPage(@Req() req) {
    return this.appService.getUserMainPage(req.id);
  }
}