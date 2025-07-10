import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entity/password_reset.entity';
import { PasswordResetService } from './password_reset.service';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  controllers: [],
  providers: [PasswordResetService],
  exports: [PasswordResetService]
})
export class PasswordResetModule {}
