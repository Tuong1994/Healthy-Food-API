import { GatewayTimeoutException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class GlobalService {
  async connection() {
    try {
      return { message: 'Api connected successfull' };
    } catch (error) {
      if (error instanceof GatewayTimeoutException) throw new GatewayTimeoutException('Timeout error');
      throw new HttpException('Api error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
