import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductInventory } from './entity/product_category.entity';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create_inventory.dto';
import { UpdateInventoryDto } from './dto/update_inventory.dto';
import { CategoryType } from '../category_type/entity/category_type.entity';
import { ProductCategory } from '../product_category/entity/product_category.entity';

@Injectable()
export class ProductInventoryService {

    constructor(@InjectRepository(ProductInventory) private readonly repo: Repository<ProductInventory>) { }

    async createOne(body: CreateInventoryDto) {

        const type: CategoryType = new CategoryType()
        const category: ProductCategory = new ProductCategory()
        type.id = body.type_id
        category.id = body.category_id

        const results = await this.repo.createQueryBuilder()
            .insert()
            .into(ProductInventory)
            .values([
                { category: category, type: type, SKU: body.SKU, qty_in_stock: body.qty_in_stock, price: body.price }
            ])
            .execute();

        if (!results) {
            throw new HttpException("Could not create product inventory!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.ACCEPTED,
            message: "Inserted Product Inventory Successfuly."
        }
    }

    async findOne(inventory_id: number) {
        return await this.repo.createQueryBuilder('i')
            .select()
            .innerJoinAndSelect('i.category', 'c', 'i.category_id = c.id')
            .innerJoinAndSelect('i.type', 't', 'i.type_id = t.id')
            .where('id = :inventory_id', { inventory_id: inventory_id })
            .getOne();
    }

    async update(body: UpdateInventoryDto) {

        const type: CategoryType = new CategoryType()
        const category: ProductCategory = new ProductCategory()
        type.id = body.type_id
        category.id = body.category_id

        const results = await this.repo.createQueryBuilder()
            .update(ProductInventory)
            .set({
                category: category,
                type: type,
                SKU: body.SKU,
                qty_in_stock: body.qty_in_stock,
                price: body.price
            })
            .where('id = :inventory_id', { inventory_id: body.inventory_id })
            .execute()

        if (!results) {
            throw new HttpException("Could not update inventory data!", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: "Updated Inventory Successfuly."
        }
    }

    async delete(inventory_id: number) {
        const results = await this.repo.createQueryBuilder()
            .delete()
            .from(ProductInventory)
            .where('id = :inventory_id', { inventory_id: inventory_id })
            .execute();

        if (!results) {
            throw new HttpException("Could not delete inventory data!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: "Deleted Inventory Successfuly."
        }
    }

}
