import { Controller, Get } from '@nestjs/common';
import { OrderStatusService } from './order_status.service';

@Controller('order-status')
export class OrderStatusController {
    
    constructor(private readonly service: OrderStatusService) {}

    @Get('get-all')
    GetAllMethods(){
        return this.service.findAll();
    }

}
