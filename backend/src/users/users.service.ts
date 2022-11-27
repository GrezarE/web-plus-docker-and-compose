import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import  {User}  from './entities/user.entities';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(createUserDto.password, 10);

    const createUserWithHashPassword: CreateUserDto = {
      ...createUserDto,
      password: hash,
    };

    const user = await this.usersRepository.create(createUserWithHashPassword);

    return this.usersRepository.save(user);
  }

  async findOne(id: number) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where({ id })
      .addSelect('user.email')
      .getOne();

    return user;
  }

  async updateOne(id: number, patchUserDto: PatchUserDto) {
    if (patchUserDto.password) {
      const hash = await bcrypt.hash(patchUserDto.password, 10);
      patchUserDto.password = hash;
    }

    await this.usersRepository.update({ id }, patchUserDto);
    const user = await this.findOne(id);
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wishes', 'wish')
      .where({ username })
      .addSelect('user.password')
      .addSelect('user.email')
      .getOne();
    return user;
  }

  async getWishes(username: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wishes', 'wish')
      .leftJoinAndSelect('wish.owner', 'owner')
      .leftJoinAndSelect('wish.offers', 'offers')
      .leftJoinAndSelect('offers.user', 'item')
      .leftJoinAndSelect('item.wishlists', 'wishlists')
      .leftJoinAndSelect('wishlists.items', 'items')
      .leftJoinAndSelect('wishlists.owner', 'owners')
      .where({ username })
      .getOne();
    const { wishes } = user;
    return wishes;
  }

  async findMany(query: any) {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: query })
      .orWhere('user.email = :email', { email: query })
      .addSelect('user.email')
      .getMany();

    return users;
  }
}
