import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ShippingMethodService } from './shipping_method.service';
import { CreateMethodDto } from './dto/create_method.dto';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Role } from 'src/common/enum/roles.enum';

@Controller('shipping-methods')
export class ShippingMethodController {

    constructor(private readonly service: ShippingMethodService) {}

    @Get('get-all')
    GetAllMethods(){
        return this.service.findAll();
    }

    @UseGuards(RolesGuard([Role.ADMIN]))
    @Post('create')
    createMethod(@Body() body: CreateMethodDto){
        return this.service.create(body);
    }

    @UseGuards(RolesGuard([Role.ADMIN]))
    @Delete('delete')
    deleteMethod(@Query('id') id: number){
        return this.service.delete(id);
    }

}
