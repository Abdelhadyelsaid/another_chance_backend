import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create_payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPayment } from './entity/user_payment.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { PaymentType } from '../payment_type/entity/payment_type.entity';
import { UpdatePaymentDto } from './dto/update_payment.dto';

@Injectable()
export class UserPaymentService {

    constructor(@InjectRepository(UserPayment) private readonly userPaymentRepo: Repository<UserPayment>) { }

    async createUserPayment(createPayment: CreatePaymentDto) {
        const user = new User()
        user.id = createPayment.user_id

        const type = new PaymentType()
        type.id = createPayment.payment_type_id

        const results = await this.userPaymentRepo.createQueryBuilder()
        .insert()
        .into(UserPayment)
        .values([
            { 
                user: user, payment_type: type,
                provider: createPayment.provider,
                account_number: createPayment.account_number,
                expiry_date: createPayment.expiry_date,
                is_default: createPayment.is_default 
            }
        ])
        .execute()

        if(!results) {
            throw new HttpException("Could not create payment!", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: "Created payment successfuly."
        }
    }
    
    async findAllUserPayments(user_id: number) {
        return await this.userPaymentRepo.createQueryBuilder()
        .select()
        .where('user_id = :user_id', { user_id: user_id })
        .getMany();
    }

    async removeUserPayment(payment_id: number) {

        const results = await this.userPaymentRepo.createQueryBuilder()
        .delete()
        .from(UserPayment)
        .where('id = :payment_id', { payment_id: payment_id })
        .execute()

        if(!results) {
            throw new HttpException("Could not remove payment!", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: "Payment removed successfuly."
        }
    }

    async updateUserPayment(updatePayment: UpdatePaymentDto) {

        const type = new PaymentType()
        type.id = updatePayment.payment_type_id

        const results = await this.userPaymentRepo.createQueryBuilder()
        .update(UserPayment)
        .set({
            payment_type: type,
            provider: updatePayment.provider,
            account_number: updatePayment.account_number,
            expiry_date: updatePayment.expiry_date,
            is_default: updatePayment.is_default
        })
        .where('id = :payment_id', { payment_id: updatePayment.payment_id })
        .execute()

        if(!results) {
            throw new HttpException("Could not update payment!", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            statusCode: HttpStatus.OK,
            message: "Payment updated successfuly."
        }
    }
}
