import {
  IsString,
  MaxLength,
  IsUrl,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsNotEmpty()
  itemsId: any[];
}
