import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { CreatePaymentDto } from './dto/create_payment.dto';
import { UpdatePaymentDto } from './dto/update_payment.dto';
import { UserPaymentService } from './user_payment.service';

@UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
@Controller('payments')
export class UserPaymentController {

    constructor(private readonly userPaymentService: UserPaymentService) { }

    @Get('get-payments')
    getUserPayments(@Query('user_id') user_id: number) {
        return this.userPaymentService.findAllUserPayments(user_id);
    }

    @Post('create')
    createUserPayment(@Body() body: CreatePaymentDto) {
        return this.userPaymentService.createUserPayment(body);
    }

    @Delete('remove')
    deleteUserPayment(@Query('payment_id') payment_id: number) {
        return this.userPaymentService.removeUserPayment(payment_id);
    }

    @Put('update')
    updateUserPayment(@Body() body: UpdatePaymentDto) {
        return this.userPaymentService.updateUserPayment(body);
    }

}
