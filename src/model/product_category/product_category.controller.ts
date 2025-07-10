import { Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { ProductCategoryService } from './product_category.service';

@Controller('product-category')
export class ProductCategoryController {

    constructor(private readonly service: ProductCategoryService) { }

    @Get('get-all')
    getAllCategories() {
        return this.service.findAll();
    }

    @UseGuards(RolesGuard([Role.ADMIN]))
    @Post('create')
    insertCategory(@Query('category') category: string) {
        return this.service.createOne(category);
    }

    @UseGuards(RolesGuard([Role.ADMIN]))
    @Delete('delete')
    deleteCategory(@Query('id') category_id: number) {
        this.service.deleteOne(category_id);
    }

}
