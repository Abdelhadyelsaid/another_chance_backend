import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType } from './entity/user_type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserTypeService {

    constructor(@InjectRepository(UserType) private readonly repo: Repository<UserType>) { }

    async findAllAdmins() {
        return this.repo.createQueryBuilder('ut')
        .select([
            'u.id',
            'u.email',
            'u.password',
            'u.first_name',
            'u.last_name',
            'u.phone_number',
        ])
        .innerJoin('ut.users', 'u', 'u.user_type_id = ut.id')
        .where('u.user_type_id = 1')
        .getMany();
    }

}
