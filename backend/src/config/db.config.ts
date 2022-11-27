import { registerAs } from '@nestjs/config';
import { User } from '../users/entities/user.entities';
import { Wish } from '../wishes/entities/wishes.entities';
import { Wishlist } from '../wishlists/entities/wishlists.entities';
import { Offer } from '../offers/entities/offers.entities';

require('dotenv').config();

export default registerAs('database', () => {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [User, Wish, Wishlist, Offer],
    synchronize: true,
  };
});
