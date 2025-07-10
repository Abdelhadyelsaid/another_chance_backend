import { Module } from '@nestjs/common';
import { ShoppingCartController } from './shopping_cart.controller';
import { ShoppingCartService } from './shopping_cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './entity/shopping_cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingCart])],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService]
})
export class ShoppingCartModule {}
