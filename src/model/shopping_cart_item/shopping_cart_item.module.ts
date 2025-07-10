import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from '../shopping_cart/entity/shopping_cart.entity';
import { ShoppingCartItem } from './entity/shopping_cart_item.entity';
import { ShoppingCartItemController } from './shopping_cart_item.controller';
import { ShoppingCartItemService } from './shopping_cart_item.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingCart, ShoppingCartItem])],
  controllers: [ShoppingCartItemController],
  providers: [ShoppingCartItemService]
})
export class ShoppingCartItemModule {}
