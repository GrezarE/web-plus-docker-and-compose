import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private offerService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    const offer = await this.offerService.create(createOfferDto, req.user.id);

    return offer;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOffers() {
    const offers = await this.offerService.findMany();

    return offers;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOffersById(@Param('id') id: number) {
    const offer = await this.offerService.findOne(id);

    return offer;
  }
}
