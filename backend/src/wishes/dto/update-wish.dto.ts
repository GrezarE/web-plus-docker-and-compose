import { IsString, MinLength, MaxLength, IsUrl, IsInt } from 'class-validator';

export class UpdateWishDto {
  @IsString()
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsInt()
  price: number;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description: string;
}
