import { Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentTypeService } from './payment_type.service';

@Controller('payment-types')
export class PaymentTypeController {

    constructor(private readonly paymentTypeService: PaymentTypeService) { }

    @Get('get-all')
    getAllTypes(){
        return this.paymentTypeService.findAllTypes();
    }

    @Post('create')
    createType(@Query('type') type: string){
        return this.paymentTypeService.createType(type);
    }

}
