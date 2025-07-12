import { Controller, Get, HttpException, HttpStatus, Query, Post, Body, UseGuards } from '@nestjs/common';
import { FilterQueries } from './dto/filter_queries.dto';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create_product.dto';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Role } from 'src/common/enum/roles.enum';

@Controller('products')
export class ProductController {

    constructor(private readonly service: ProductService) { }

    @Get('get-one')
    getProduct(@Query('id') id: number) {
        return this.service.findOne(id);
    }

    @Get('search')
    searchForProducts(@Query('query') name: string) {
        if(!name) {
            throw new HttpException("You didn't provide the query!", HttpStatus.BAD_REQUEST);
        }
        
        return this.service.search(name);
    }

    @Get('best-seller')
    getBestSeller() {
        return this.service.getBestSeller();
    }

    @Get('new-arrival')
    getNewArrivals() {
        return this.service.getNewArrivals();
    }

    @Get('filter')
    filterProducts(
        @Query() queries: FilterQueries
    ) {
        const filters: any = {}

        if (queries.query) {
            filters.query = queries.query;
        }
        if (queries.category_id) {
            filters.category_id = queries.category_id;
        }
        if (queries.type_id) {
            filters.type_id = queries.type_id;
        }
        if (queries.minimum_price) {
            filters.minimum_price = queries.minimum_price;
        }
        if (queries.maximum_price) {
            filters.maximum_price = queries.maximum_price;
        }
        if (queries.page) {
            filters.page = queries.page;
        }
        if (queries.size) {
            filters.size = queries.size;
        }

        return this.service.filter(filters);
    }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Post('store')
    storeProduct(@Body() body: CreateProductDto) {
        return this.service.storeProduct(body);
    }

}
