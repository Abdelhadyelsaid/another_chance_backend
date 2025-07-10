import { Controller, Get } from '@nestjs/common';
import { GovernorateService } from './governorate.service';

@Controller('governorates')
export class GovernorateController {

    constructor(private readonly governorateService: GovernorateService) { }

    @Get('get-all')
    getAllGovernorates() {
        return this.governorateService.findAll();
    }

}
