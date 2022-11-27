import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import  {Wish}  from './entities/wishes.entities';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import  {User} from 'src/users/entities/user.entities';
import { UserOwnException } from './exceptions/user-own-wish.exception';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User) {
    const wishData = {
      ...createWishDto,
      owner,
    };
    const wish = this.wishRepository.create(wishData);
    return this.wishRepository.save(wish);
  }

  async findOne(id: number) {
    const wish = await this.wishRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.owner', 'owner')
      .leftJoinAndSelect('wish.offers', 'offers')
      .leftJoinAndSelect('offers.user', 'user')
      .leftJoinAndSelect('user.wishes', 'wishes')
      .leftJoinAndSelect('user.offers', 'offer')
      .leftJoinAndSelect('user.wishlists', 'wishlists')
      .where({ id })
      .getOne();
    return wish;
  }

  async updateOne(id, updateWishDto: UpdateWishDto, user) {
    const wish = await this.findOne(id);
    if (wish.owner.id !== user) {
      throw new UserOwnException();
    }
    if (wish.offers.length > 0) {
      const { price, ...result } = updateWishDto;
      await this.wishRepository.update({ id }, result);
      return await this.findOne(id);
    }
    await this.wishRepository.update({ id }, updateWishDto);
    return await this.findOne(id);
  }

  async findMany(orderBy: string, limit: number) {
    const wishes = await this.wishRepository
      .createQueryBuilder('wish')
      .limit(limit)
      .leftJoinAndSelect('wish.owner', 'owner')
      .leftJoinAndSelect('wish.offers', 'offers')
      .leftJoinAndSelect('offers.user', 'user')
      .leftJoinAndSelect('user.wishlists', 'wishlists')
      .orderBy(`wish.${orderBy}`, 'DESC')
      .getMany();
    return wishes;
  }

  async getRaised(id: number) {
    const amount = await this.wishRepository
      .createQueryBuilder('wish')
      .select('wish.raised')
      .addSelect('wish.price')
      .where({ id })
      .getOne();
    return amount;
  }

  async updateRaised(id: number, raised: number) {
    await this.wishRepository
      .createQueryBuilder()
      .update(Wish)
      .set({ raised })
      .where({ id })
      .execute();
  }

  async updateCopied(id, copied) {
    copied = copied + 1;
    await this.wishRepository
      .createQueryBuilder()
      .update(Wish)
      .set({ copied })
      .where({ id })
      .execute();
  }

  async deleteOne(id: number, userId: number) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException();
    }
    if (wish.owner.id !== userId) {
      throw new UserOwnException();
    }
    await this.wishRepository
      .createQueryBuilder()
      .delete()
      .from(Wish)
      .where('id = :id', { id })
      .execute();

    return wish;
  }

  async copyWish(id: number, userId: User) {
    const { name, link, image, price, description, copied } =
      await this.findOne(id);
    const wishCopy = {
      name,
      link,
      image,
      price,
      description,
    };
    await this.create(wishCopy, userId);
    await this.updateCopied(id, copied);
  }
}
