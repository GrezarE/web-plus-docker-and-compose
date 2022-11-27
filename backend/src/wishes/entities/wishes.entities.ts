import { Max, IsUrl, IsInt, Min } from 'class-validator';
import {Offer}  from 'src/offers/entities/offers.entities';
import  {User}  from 'src/users/entities/user.entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export  class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Max(250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsInt()
  price: number;

  @Column({ default: 0 })
  raised: number;

  @Column()
  @Min(1)
  @Max(1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item, { cascade: true, eager: true })
  offers: Offer[];

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;

  @Column({ default: 0 })
  copied: number;
}
