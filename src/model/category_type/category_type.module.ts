import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryType } from './entity/category_type.entity';
import { CategoryTypeService } from './category_type.service';
import { CategoryTypeController } from './category_type.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryType])],
    providers: [CategoryTypeService],
    controllers: [CategoryTypeController]
})
export class CategoryTypeModule {}
