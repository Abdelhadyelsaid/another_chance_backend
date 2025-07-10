import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { UserPaymentModule } from '../user_payment/user_payment.module';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PasswordResetModule } from 'src/model/password_reset/password_reset.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    global: true,
    secret: process.env.JWT_TOKEN,
  }),
    UserPaymentModule,
    EmailModule,
    PasswordResetModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
