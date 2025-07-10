import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserTypeService } from './user_type.service';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Role } from 'src/common/enum/roles.enum';

@Controller('user-type')
export class UserTypeController {

    constructor(private readonly service: UserTypeService) { }

    @UseGuards(RolesGuard([Role.ADMIN]))
    @Get('admins')
    getAllAdmins(){
        return this.service.findAllAdmins();
    }

}
