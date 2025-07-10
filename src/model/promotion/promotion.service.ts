import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entity/product.entity';
import { Promotion } from './entity/promotion.entity';
import { CreatePromotionDto } from './dto/create_promotion.dto';

@Injectable()
export class PromotionService {

    constructor(
        @InjectRepository(Promotion) private readonly promotionRepo: Repository<Promotion>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>
    ) { }

    async findAll(exclude_ended: boolean) {
        
        const date = new Date()
        const current_date = date.toISOString()

        const query_builder = this.promotionRepo.createQueryBuilder()
            .select()

        if(exclude_ended.valueOf() == true) {
            query_builder.where('promotion.start_date < :current_date', { current_date: current_date })
            .andWhere('promotion.end_date > :current_date', { current_date: current_date });
        }

        return query_builder.getMany();
    }

    async create(body: CreatePromotionDto) {

        const product = new Product();
        product.id = body.product_id;

        const results = await this.promotionRepo.createQueryBuilder()
            .insert()
            .into(Promotion)
            .values([
                {
                    product: product,
                    name: body.name,
                    description: body.description,
                    discount_rate: body.discount_rate,
                    start_date: body.start_date,
                    end_date: body.end_date
                }
            ])
            .execute()

        if (!results) {
            throw new HttpException("Could not create promotion!", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: "Created promtion successfuly."
        }
    }

    async findAllProducts() {

        const date = new Date()
        const current_date = date.toISOString()

        const products = await this.productRepo.createQueryBuilder('product')
            .select([
                'product.id',
                'product.name',
                'product.main_image',
                'inventory.price',
                'inventory.qty_in_stock',
                'promotion.id',
                'promotion.name',
                'promotion.description',
                'promotion.discount_rate',
                'promotion.start_date',
                'promotion.end_date'
            ])
            .innerJoinAndSelect('product.inventory', 'inventory', 'product.inventory_id = inventory.id')
            .innerJoinAndSelect('product.promotion', 'promotion', 'product.id = promotion.product_id')
            .where('promotion.start_date < :current_date', { current_date: current_date })
            .andWhere('promotion.end_date > :current_date', { current_date: current_date })
            .getMany()

        if (!products) {
            throw new HttpException("There is no products with discounts!", HttpStatus.NO_CONTENT);
        }

        return this.calculateNewPrice(products);
    }

    calculateNewPrice(products: Product[]) {
        const final_products = [];

        for (let x = 0; x < products.length; x++) {
            const current_product: Product = products.at(x);
            const discount_rate = current_product.promotion.discount_rate / 100;
            const old_price = current_product.inventory.price;
            const new_price = old_price - (old_price * discount_rate);
            const stringfied = JSON.stringify(current_product);
            const json_product = JSON.parse(stringfied);
            json_product.new_price = new_price;
            final_products.push(json_product);
        }

        return final_products;
    }

}
