import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Role } from 'src/common/enum/roles.enum';
import { CreatePromotionDto } from './dto/create_promotion.dto';

@Controller('promotions')
export class PromotionController {

    constructor(private readonly service: PromotionService) { }

    @UseGuards(RolesGuard([Role.ADMIN]))
    @Post('create')
    createPromotion(@Body() body: CreatePromotionDto){
        if(!body) {
            throw new HttpException("You did't provide a body!", HttpStatus.BAD_REQUEST);
        }

        return this.service.create(body);
    }

    @Get('get-all')
    getAllPromotions(@Query('exclude_ended') exclude_ended: boolean) {
        return this.service.findAll(exclude_ended);
    }

    @Get('products')
    getAllProducts() {
        return this.service.findAllProducts();
    }

}
