import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import  {User} from 'src/users/entities/user.entities';
import { UserOwnException } from 'src/wishes/exceptions/user-own-wish.exception';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWislistDto } from './dto/update-wishlist.dto';
import  {Wishlist}  from './entities/wishlists.entities';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlishRepository: Repository<Wishlist>,
    private wishService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, owner: User) {
    const wishes = await this.getWishesById(createWishlistDto.itemsId);

    const wishlistData = {
      owner,
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      items: wishes,
    };

    const wishlist = this.wishlishRepository.create(wishlistData);

    return this.wishlishRepository.save(wishlist);
  }
  async findOne(id: number) {
    const wishlist = await this.wishlishRepository
      .createQueryBuilder('wishlist')
      .leftJoinAndSelect('wishlist.owner', 'owner')
      .leftJoinAndSelect('wishlist.items', 'items')
      .where('wishlist.id = :id', { id })
      .getOne();

    return wishlist;
  }
  async updateOne(
    wishlistId: number,
    updateWishlistDto: UpdateWislistDto,
    user: number,
  ) {
    const wish = await this.findOne(wishlistId);
    if (wish.owner.id !== user) {
      return null;
    }
    const wishes = await this.getWishesById(updateWishlistDto.itemsId);

    (wish.name = updateWishlistDto.name || wish.name),
      (wish.image = updateWishlistDto.image || wish.image),
      (wish.items = wishes || wish.items);

    return this.wishlishRepository.save(wish);
  }
  async deleteOne(id: number, owner: number) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException();
    }
    if (wishlist.owner.id !== owner) {
      throw new UserOwnException();
    }
    await this.wishlishRepository
      .createQueryBuilder()
      .delete()
      .from(Wishlist)
      .where('id = :id', { id })
      .execute();

    return wishlist;
  }

  async findMany() {
    const wishlists = this.wishlishRepository
      .createQueryBuilder('wishlists')
      .leftJoinAndSelect('wishlists.owner', 'owner')
      .leftJoinAndSelect('wishlists.items', 'items')
      .getMany();

    return wishlists;
  }

  async getWishesById(array: any[]) {
    let resolvedWishes: any[] = [];
    const wishes = array?.map(async (item) => {
      const { owner, offers, ...wish } = await this.wishService.findOne(item);
      return wish;
    });

    if (wishes) {
      for (const asyncWish of wishes) {
        const result = await asyncWish;
        resolvedWishes.push(result);
      }
    }

    return resolvedWishes;
  }
}
