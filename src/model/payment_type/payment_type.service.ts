import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentType } from './entity/payment_type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentTypeService {

    constructor(@InjectRepository(PaymentType) private readonly paymentTypeRepo: Repository<PaymentType>) { }

    async findAllTypes(){
        return await this.paymentTypeRepo.createQueryBuilder()
        .select()
        .getMany();
    }


    async createType(type: string){
        const results = await this.paymentTypeRepo.createQueryBuilder()
        .insert()
        .into(PaymentType)
        .values([
            {
                type: type
            }
        ])
        .execute();

        if(!results){
            throw new HttpException("Could not create type!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: "Created payment successfuly."
        }
    }
    
}
