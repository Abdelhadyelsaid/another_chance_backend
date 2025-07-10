import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationMiddleware } from 'src/common/middlewares/authorization.middleware';
import { CategoryTypeModule } from '../category_type/category_type.module';
import { CategoryType } from '../category_type/entity/category_type.entity';
import { GatewayModule } from '../gateway/gateway.module';
import { Governorate } from '../governorate/entity/governorate.entity';
import { GovernorateModule } from '../governorate/governorate.module';
import { PaymentType } from '../payment_type/entity/payment_type.entity';
import { PaymentTypeModule } from '../payment_type/payment_type.module';
import { Product } from '../product/entity/product.entity';
import { ProductModule } from '../product/product.module';
import { ProductCategory } from '../product_category/entity/product_category.entity';
import { ProductCategoryModule } from '../product_category/product_category.module';
import { ProductInventory } from '../product_inventory/entity/product_category.entity';
import { ProductInventoryModule } from '../product_inventory/product_inventory.module';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { UserAddress } from '../user_address/entity/user_address.entity';
import { UserAddressModule } from '../user_address/user_address.module';
import { UserPayment } from '../user_payment/entity/user_payment.entity';
import { UserPaymentModule } from '../user_payment/user_payment.module';
import { UserType } from '../user_type/entity/user_type.entity';
import { UserTypeModule } from '../user_type/user_type.module';
import { ShippingMethod } from '../shipping_method/entity/shipping_method.entity';
import { OrderStatus } from '../order_status/entity/order_status.entity';
import { ShopOrder } from '../shop_order/entity/shop_order.entity';
import { ShoppingCart } from '../shopping_cart/entity/shopping_cart.entity';
import { ShoppingCartItem } from '../shopping_cart_item/entity/shopping_cart_item.entity';
import { ShippingMethodModule } from '../shipping_method/shipping_method.module';
import { OrderStatusModule } from '../order_status/order_status.module';
import { ShopOrderModule } from '../shop_order/shop_order.module';
import { ShoppingCartModule } from '../shopping_cart/shopping_cart.module';
import { ShoppingCartItemModule } from '../shopping_cart_item/shopping_cart_item.module';
import { PromotionModule } from '../promotion/promotion.module';
import { Promotion } from '../promotion/entity/promotion.entity';
import { OrderLine } from '../order_line/entity/order_line.entity';
import { OrderLineModule } from '../order_line/order_line.module';
import { PasswordResetModule } from '../password_reset/password_reset.module';
import { PasswordReset } from '../password_reset/entity/password_reset.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<any>('DATABASE_TYPE'),
          host: config.get<string>('DATABASE_HOST'),
          port: Number(config.get('DATABASE_PORT')),
          username: config.get<string>('DATABASE_USERNAME'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
          synchronize: false,
          entities: [
            UserPayment,
            User,
            UserType,
            UserAddress,
            PaymentType,
            Governorate,
            CategoryType,
            Product,
            ProductCategory,
            ProductInventory,
            Promotion,
            ShippingMethod,
            OrderStatus,
            ShopOrder,
            OrderLine,
            ShoppingCart,
            ShoppingCartItem,
            PasswordReset
          ]
        }
      }
    }),
    UserPaymentModule,
    UserModule,
    UserTypeModule,
    UserAddressModule,
    PaymentTypeModule,
    GovernorateModule,
    CategoryTypeModule,
    ProductModule,
    ProductCategoryModule,
    ProductInventoryModule,
    GatewayModule,
    PromotionModule,
    ShippingMethodModule,
    OrderStatusModule,
    ShopOrderModule,
    ShoppingCartModule,
    ShoppingCartItemModule,
    OrderLineModule,
    PasswordResetModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('*')
  }
}
