import { IsString, IsUrl, IsArray } from 'class-validator';

export class UpdateWislistDto {
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: any[];
}
