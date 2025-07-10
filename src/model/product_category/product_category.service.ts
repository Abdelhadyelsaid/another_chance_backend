import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entity/product_category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductCategoryService {

    constructor(@InjectRepository(ProductCategory) private readonly repo: Repository<ProductCategory>) { }

    async findAll() {
        return await this.repo.createQueryBuilder()
            .select()
            .getMany();
    }

    async createOne(category: string) {
        const results = await this.repo.createQueryBuilder()
            .insert()
            .into(ProductCategory)
            .values([
                { category_name: category }
            ])
            .execute();

        if (!results) {
            throw new HttpException("Could not create category!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.ACCEPTED,
            message: "Inserted Category Successfuly."
        }
    }

    async deleteOne(category_id: number) {
        const results = await this.repo.createQueryBuilder()
            .delete()
            .from(ProductCategory)
            .where('id = :category_id', { category_id: category_id })
            .execute();

        if (!results) {
            throw new HttpException("Could not delete category!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: "Deleted Category Successfuly."
        }
    }

}
