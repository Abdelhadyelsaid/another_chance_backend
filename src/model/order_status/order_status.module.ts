import { Module } from '@nestjs/common';
import { OrderStatusService } from './order_status.service';
import { OrderStatusController } from './order_status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatus } from './entity/order_status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatus])],
  providers: [OrderStatusService],
  controllers: [OrderStatusController]
})
export class OrderStatusModule {}
