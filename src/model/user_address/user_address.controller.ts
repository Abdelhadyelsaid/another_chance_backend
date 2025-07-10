import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { CreateAddressDto } from './dto/create_address.dto';
import { UpdateAddressDto } from './dto/update_address.dto';
import { UserAddressService } from './user_address.service';

@UseGuards(RolesGuard([Role.ADMIN, Role.CUSTOMER]))
@Controller('addresses')
export class UserAddressController {

    constructor(private readonly userAddressService: UserAddressService) { }

    @Post('create')
    createUserAddress(@Body() body: CreateAddressDto) {
        return this.userAddressService.createAddress(body);
    }

    @Get('get-addresses')
    getUserAddresses(@Query('user_id') user_id: number) {
        return this.userAddressService.findAllUserAddresses(user_id);
    }

    @Put('update')
    updateUserAddress(@Body() body: UpdateAddressDto) {
        return this.userAddressService.updateUserAddress(body);
    }

}
