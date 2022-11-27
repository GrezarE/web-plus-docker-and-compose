import { Max, IsUrl, Min } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import  {Wish}  from 'src/wishes/entities/wishes.entities';
import  {User}  from 'src/users/entities/user.entities';

@Entity()
export  class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Min(1)
  @Max(250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.id, { cascade: true })
  @JoinTable()
  items: any[];

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;
}
