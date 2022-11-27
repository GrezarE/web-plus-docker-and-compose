import { HttpException, HttpStatus } from '@nestjs/common';

export class RaisedExcessException extends HttpException {
  constructor() {
    super(
      'Сумма собранных средств не может превышать стоимость подарка',
      HttpStatus.BAD_REQUEST,
    );
  }
}
