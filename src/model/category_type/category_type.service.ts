import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryType } from './entity/category_type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryTypeService {

    constructor(@InjectRepository(CategoryType) private readonly repo: Repository<CategoryType>) { }

    async findAll() {
        return await this.repo.createQueryBuilder()
            .select()
            .getMany();
    }

    async createOne(type: string) {
        const results = await this.repo.createQueryBuilder()
            .insert()
            .into(CategoryType)
            .values([
                { type: type }
            ])
            .execute();

        if (!results) {
            throw new HttpException("Could not create category type!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.ACCEPTED,
            message: "Inserted Type Successfuly."
        }
    }

    async deleteOne(type_id: number) {
        const results = await this.repo.createQueryBuilder()
            .delete()
            .from(CategoryType)
            .where('id = :type_id', { type_id: type_id })
            .execute();

        if (!results) {
            throw new HttpException("Could not delete category type!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: "Deleted Type Successfuly."
        }
    }

}
