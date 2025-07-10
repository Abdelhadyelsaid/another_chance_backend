import { Module } from '@nestjs/common';
import { OrderLineController } from './order_line.controller';
import { OrderLineService } from './order_line.service';

@Module({
  controllers: [OrderLineController],
  providers: [OrderLineService]
})
export class OrderLineModule {}
