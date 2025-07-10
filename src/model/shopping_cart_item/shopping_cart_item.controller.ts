import { Body, Controller, Delete, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { ShoppingCartItemService } from './shopping_cart_item.service';
import { AddToCartDto } from './dto/add_to_cart.dto';

@Controller('carts')
export class ShoppingCartItemController {

    constructor(private readonly service: ShoppingCartItemService) { }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Post('add-to-cart')
    getCartByUserId(@Body() body: AddToCartDto, @Req() request: any) {
        if(!request.user_id) {
            throw new HttpException("There is something wrong with your authorization token!", HttpStatus.FORBIDDEN);
        }

        return this.service.create(body, request.user_id);
    }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Delete('remove-from-cart')
    removeFromCart(@Query('cart_item_id') item_id: number, @Req() request: any) {
        if(!request.user_id) {
            throw new HttpException("There is something wrong with your authorization token!", HttpStatus.FORBIDDEN);
        }

        return this.service.remove(item_id, request.user_id);
    }

}
