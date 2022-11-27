import {
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  image: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description: string;
}
