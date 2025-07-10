import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from '../shopping_cart/entity/shopping_cart.entity';
import { ShoppingCartItem } from '../shopping_cart_item/entity/shopping_cart_item.entity';
import { User } from '../user/entity/user.entity';
import { ShopOrder } from './entity/shop_order.entity';
import { ShopOrderController } from './shop_order.controller';
import { ShopOrderService } from './shop_order.service';
import { OrderLine } from '../order_line/entity/order_line.entity';
import { UserAddress } from '../user_address/entity/user_address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress, ShopOrder, OrderLine, ShoppingCart, ShoppingCartItem])],
  providers: [ShopOrderService],
  controllers: [ShopOrderController]
})
export class ShopOrderModule {}
