import { Module } from '@nestjs/common';
import { GovernorateService } from './governorate.service';
import { GovernorateController } from './governorate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Governorate } from './entity/governorate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Governorate])],
  providers: [GovernorateService],
  controllers: [GovernorateController]
})
export class GovernorateModule {}
