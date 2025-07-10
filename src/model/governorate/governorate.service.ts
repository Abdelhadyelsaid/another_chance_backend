import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Governorate } from './entity/governorate.entity';

@Injectable()
export class GovernorateService {

    constructor(@InjectRepository(Governorate) private readonly governorateRepo: Repository<Governorate>) { }


    async findAll() {
        return await this.governorateRepo.createQueryBuilder('g')
        .select()
        .getMany();
    }

}
