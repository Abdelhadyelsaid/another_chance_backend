import { Controller, Get, HttpException, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { ShoppingCartService } from './shopping_cart.service';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Role } from 'src/common/enum/roles.enum';

@Controller('carts')
export class ShoppingCartController {

    constructor(private readonly service: ShoppingCartService) { }

    @UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
    @Get('get-one')
   async getCartByUserId(@Req() request: any) {
        if(!request.user.id) {
            throw new HttpException("There is something wrong with your authorization token!", HttpStatus.FORBIDDEN);
        }

        return await this.service.findOne(request.user.id);
    }

}
