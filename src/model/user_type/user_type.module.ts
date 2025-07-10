import { Module } from '@nestjs/common';
import { UserTypeController } from './user_type.controller';
import { UserTypeService } from './user_type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserType } from './entity/user_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserType])],
  controllers: [UserTypeController],
  providers: [UserTypeService]
})
export class UserTypeModule {}
