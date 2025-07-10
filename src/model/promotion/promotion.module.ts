import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entity/product.entity';
import { Promotion } from './entity/promotion.entity';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, Product])],
  providers: [PromotionService],
  controllers: [PromotionController]
})
export class PromotionModule {}
