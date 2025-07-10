import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductInventory } from './entity/product_category.entity';
import { ProductInventoryController } from './product_inventory.controller';
import { ProductInventoryService } from './product_inventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductInventory])],
  providers: [ProductInventoryService],
  controllers: [ProductInventoryController]
})
export class ProductInventoryModule { }
