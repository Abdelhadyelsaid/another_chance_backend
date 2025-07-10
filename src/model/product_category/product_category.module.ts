import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entity/product_category.entity';
import { ProductCategoryController } from './product_category.controller';
import { ProductCategoryService } from './product_category.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductCategory])],
    providers: [ProductCategoryService],
    controllers: [ProductCategoryController]
})
export class ProductCategoryModule { }
