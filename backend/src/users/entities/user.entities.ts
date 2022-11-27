import { Min, Max, IsEmail, IsUrl } from 'class-validator';
import  {Offer}  from 'src/offers/entities/offers.entities';
import  {Wish}  from 'src/wishes/entities/wishes.entities';
import  {Wishlist}  from 'src/wishlists/entities/wishlists.entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @Min(2)
  @Max(30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Min(2)
  @Max(200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true, select: false })
  @IsEmail()
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
