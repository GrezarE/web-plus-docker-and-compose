import { HttpException, HttpStatus } from '@nestjs/common';

export class UserOwnException extends HttpException {
  constructor() {
    super('Вы не являетесь владельцем', HttpStatus.FORBIDDEN);
  }
}
