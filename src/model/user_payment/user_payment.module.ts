import { Module } from '@nestjs/common';
import { UserPaymentService } from './user_payment.service';
import { UserPaymentController } from './user_payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPayment } from './entity/user_payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPayment])],
  providers: [UserPaymentService],
  controllers: [UserPaymentController],
  exports: [UserPaymentService]
})
export class UserPaymentModule {}
