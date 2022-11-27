import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import  {Offer}  from './entities/offers.entities';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { RaisedExcessException } from './exceptions/raised-excess.exception';
import { UserOwnOfferException } from './exceptions/user-own.exception';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: any) {
    const checkUser = await this.checkUser(createOfferDto.itemId, user);

    if (checkUser) {
      throw new UserOwnOfferException();
    }

    const { price, raised } = await this.wishService.getRaised(
      createOfferDto.itemId,
    );

    const newRaised = raised + createOfferDto.amount;
    if (price < newRaised) {
      throw new RaisedExcessException();
    }

    const offerData = {
      user,
      item: createOfferDto.itemId,
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden,
    };
    const offer = await this.offerRepository.create(offerData);
    await this.wishService.updateRaised(createOfferDto.itemId, newRaised);

    return this.offerRepository.save(offer);
  }

  async findMany() {
    const offers = await this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.item', 'wish')
      .leftJoinAndSelect('wish.owner', 'owner')
      .leftJoinAndSelect('offer.user', 'user')
      .leftJoinAndSelect('user.wishes', 'wishes')
      .leftJoinAndSelect('user.offers', 'offers')
      .leftJoinAndSelect('user.wishlists', 'wishlists')
      .getMany();

    return offers;
  }

  async findOne(id: number) {
    const offer = await this.offerRepository
      .createQueryBuilder('offer')
      .where({ id })
      .innerJoinAndSelect('offer.item', 'item')
      .leftJoinAndSelect('item.owner', 'owner')
      .leftJoinAndSelect('offer.user', 'user')
      .leftJoinAndSelect('user.wishes', 'wishes')
      .leftJoinAndSelect('user.offers', 'offers')
      .leftJoinAndSelect('user.wishlists', 'wishlists')
      .getOne();
    return offer;
  }

  async checkUser(itemId, id) {
    const itemOwnerId = await this.wishService.findOne(itemId);
    return itemOwnerId.owner.id === id;
  }
}
