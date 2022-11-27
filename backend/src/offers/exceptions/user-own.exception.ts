import { HttpException, HttpStatus } from '@nestjs/common';

export class UserOwnOfferException extends HttpException {
  constructor() {
    super(
      'Пользователь не может вносить деньги на собственные подарки',
      HttpStatus.BAD_REQUEST,
    );
  }
}
