import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Req,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWishlists() {
    const wishlists = this.wishlistService.findMany();
    return wishlists;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req,
  ) {
    const wishlist = await this.wishlistService.create(
      createWishlistDto,
      req.user.id,
    );
    return wishlist;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getWishlistById(@Param('id') id: number) {
    const wishlist = await this.wishlistService.findOne(id);
    return wishlist;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWishlistById(@Param('id') id: number, @Body() Body, @Req() req) {
    const wishlist = await this.wishlistService.updateOne(
      id,
      Body,
      req.user.id,
    );

    return wishlist;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteWishlistById(@Param('id') id: number, @Req() req) {
    const deletedWishlist = await this.wishlistService.deleteOne(
      id,
      req.user.id,
    );
    return deletedWishlist;
  }
}
