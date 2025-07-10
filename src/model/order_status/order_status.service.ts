import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from './entity/order_status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderStatusService {

    constructor(@InjectRepository(OrderStatus) private readonly repo: Repository<OrderStatus>) {}

    async findAll(){
        return await this.repo.createQueryBuilder()
        .select()
        .getMany();
    }

}
