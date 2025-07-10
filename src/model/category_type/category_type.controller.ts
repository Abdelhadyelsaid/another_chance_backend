import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CategoryTypeService } from './category_type.service';

@Controller('category-types')
export class CategoryTypeController {

    constructor(private readonly service: CategoryTypeService) { }

    @Get('get-all')
    getAllTypes() {
        return this.service.findAll();
    }

    @Post('create')
    insertType(@Query('type') type: string) {
        return this.service.createOne(type);
    }

    @Delete('delete')
    deleteType(@Query('id') type_id: number){
        this.service.deleteOne(type_id);
    }

}
