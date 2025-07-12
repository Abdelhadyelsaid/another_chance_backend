import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { CancelOrderDto } from './dto/cancel_order.dto';
import { PlaceOrderDto } from './dto/place_order.dto';
import { UpdateOrderStatusDto } from './dto/update_status.dto';
import { ShopOrderService } from './shop_order.service';

@Controller('orders')
export class ShopOrderController {

    constructor(private readonly service: ShopOrderService) { }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Post('place-order')
    placeOrder(@Body() body: PlaceOrderDto, @Req() request: any){
        
        if(!request.user || !request.user.id) {
            throw new HttpException("There is something wrong with your authorization token!", HttpStatus.FORBIDDEN);
        }
        
        return this.service.placeOrder(request.user.id);
    }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Get('get-orders')
    getOrders(@Req() request: any){
        
        if(!request.user || !request.user.id) {
            throw new HttpException("There is something wrong with your authorization token!", HttpStatus.FORBIDDEN);
        }
        
        return this.service.findUserOrders(request.user.id);
    }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Get('my-orders')
    getAllMyOrders(@Req() request: any){
        
        if(!request.user || !request.user.id) {
            throw new HttpException("There is something wrong with your authorization token!", HttpStatus.FORBIDDEN);
        }
        
        return this.service.myOrders(request.user.id);
    }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Get('get-order')
    getOrder(@Query('order_id') order_id: number, @Req() request: any){
        
        if(!request.user || !request.user.id) {
            throw new HttpException("There is something wrong with your authorization token!", HttpStatus.FORBIDDEN);
        }
        
        return this.service.findOne(order_id);
    }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Get('preplacing-order')
    getPreplacingOrderInfo(@Req() request: any){
        
        if(!request.user || !request.user.id) {
            throw new HttpException("There is something wrong with your authorization token!", HttpStatus.FORBIDDEN);
        }
        
        return this.service.preplacingOrder(request.user.id);
    }
    

    @UseGuards(RolesGuard([Role.ADMIN]))
    @Patch('update-status')
    changeOrderStatus(@Body() body: UpdateOrderStatusDto){
        
        if(!body) {
            throw new HttpException("You did't provide a body for the request!", HttpStatus.BAD_REQUEST);
        }
        
        return this.service.updateOrderStatus(body);
    }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Patch('cancel-order')
    cancelOrder(@Body() body: CancelOrderDto){
        
        if(!body) {
            throw new HttpException("You did't provide a body for the request!", HttpStatus.BAD_REQUEST);
        }

        return this.service.cancelOrder(body);
    }

}
