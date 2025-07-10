import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create_inventory.dto';
import { ProductInventoryService } from './product_inventory.service';
import { UpdateInventoryDto } from './dto/update_inventory.dto';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Role } from 'src/common/enum/roles.enum';

@Controller('product-inventory')
export class ProductInventoryController {

    constructor(private readonly service: ProductInventoryService) {}

    @UseGuards(RolesGuard([Role.ADMIN]))
    @Post('create')
    createProductInventory(@Body() body: CreateInventoryDto) {
        return this.service.createOne(body);
    }
    
    @Get('get-one')
    getProductInventory(@Query('inventory_id') id: number) {

        if(!id) {
            throw new HttpException("You didn't provide an inventory id.", HttpStatus.BAD_REQUEST)
        }

        return this.service.findOne(id);
    }
    
    @UseGuards(RolesGuard([Role.ADMIN]))
    @Put('update')
    updateProductInventory(@Body() body: UpdateInventoryDto) {
        return this.service.update(body);
    }

    @UseGuards(RolesGuard([Role.ADMIN]))
    @Delete('delete')
    deleteProductInventory(@Query('inventory_id') id: number) {

        if(!id) {
            throw new HttpException("You didn't provide an inventory id.", HttpStatus.BAD_REQUEST)
        }

        return this.service.delete(id);
    }

}
