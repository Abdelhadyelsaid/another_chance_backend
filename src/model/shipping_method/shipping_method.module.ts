import { Module } from '@nestjs/common';
import { ShippingMethodController } from './shipping_method.controller';
import { ShippingMethodService } from './shipping_method.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingMethod } from './entity/shipping_method.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ShippingMethod])],
  controllers: [ShippingMethodController],
  providers: [ShippingMethodService]
})
export class ShippingMethodModule {}
