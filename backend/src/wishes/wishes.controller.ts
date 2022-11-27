import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Param,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(@Body() createWishDto: CreateWishDto, @Req() req) {
    const wish = this.wishesService.create(createWishDto, req.user.id);

    return wish;
  }
  @Get('last')
  async getLast() {
    const wishes = this.wishesService.findMany('createdAt', 40);
    return wishes;
  }

  @Get('top')
  async getTop() {
    const wishes = this.wishesService.findMany('copied', 20);
    return wishes;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getWishById(@Param('id') id: number) {
    const wish = this.wishesService.findOne(id);
    return wish;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWish(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    const wish = await this.wishesService.updateOne(
      id,
      updateWishDto,
      req.user.id,
    );
    return wish;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteWish(@Param('id') id: number, @Req() req) {
    const deletedWish = await this.wishesService.deleteOne(id, req.user.id);
    return deletedWish;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Req() req) {
    await this.wishesService.copyWish(id, req.user.id);
    return {};
  }
}
