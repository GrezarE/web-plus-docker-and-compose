import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsUrl,
} from 'class-validator';

export class PatchUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
