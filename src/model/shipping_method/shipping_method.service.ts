import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingMethod } from './entity/shipping_method.entity';
import { Repository } from 'typeorm';
import { CreateMethodDto } from './dto/create_method.dto';

@Injectable()
export class ShippingMethodService {

    constructor(@InjectRepository(ShippingMethod) private readonly repo: Repository<ShippingMethod>) {}

    async findAll(){
        return await this.repo.createQueryBuilder()
        .select()
        .getMany();
    }

    async create(body: CreateMethodDto){
        const results =  await this.repo.createQueryBuilder()
        .insert()
        .into(ShippingMethod)
        .values([
            { name: body.name, price: body.price }
        ])
        .execute();

        if(!results) {
            throw new HttpException("Could not insert a new shipping method!", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: "Inserted new shipping method successfuly."
        }
    }

    async delete(id: number){
        const results =  await this.repo.createQueryBuilder()
        .delete()
        .from(ShippingMethod)
        .where('id = :id', { id: id })
        .execute();

        if(!results) {
            throw new HttpException("Could not delete this shipping method!", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: "Deleted shipping method successfuly."
        }
    }

}
