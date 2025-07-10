import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductService {

    constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) { }

    async findOne(product_id: number) {
        const product = await this.repo.createQueryBuilder('p')
            .select()
            .innerJoinAndSelect('p.inventory', 'i', 'p.inventory_id = i.id')
            .innerJoinAndSelect('i.category', 'c', 'i.category_id = c.id')
            .innerJoinAndSelect('i.type', 't', 'i.type_id = t.id')
            .leftJoinAndSelect('p.promotion', 'pr', 'pr.product_id = p.id')
            .where('p.id = :product_id', { product_id: product_id })
            .getOne()

        if (!product) {
            throw new HttpException("There is no product with that id!", HttpStatus.NOT_FOUND)
        }

        const promoted_product = this.reformatPromotedProduct(product)

        return this.reformatSecondaryImages(promoted_product);
    }

    async search(search_query: string) {

        const formatted_query = search_query.replace(' ', '%');

        const query = this.repo.createQueryBuilder('p')
            .select([
                'p.id',
                'p.name',
                'p.main_image',
                'i.price',
                'i.qty_in_stock'
            ])
            .innerJoin('p.inventory', 'i', 'p.inventory_id = i.id')
            .innerJoinAndSelect('i.category', 'c', 'i.category_id = c.id')
            .innerJoinAndSelect('i.type', 't', 'i.type_id = t.id')
            .where('p.name LIKE :name', { name: `%${formatted_query}%` });

        const products = await query.getMany();

        if (!products || products.length == 0) {
            throw new HttpException("There is no products with that search query!", HttpStatus.NOT_FOUND)
        }
        
        const count = await query.getCount();
        const reformed = this.reformatPromotedProducts(products);
        return this.reformatPages(reformed, count);
    }


    async getBestSeller() {

        const products = await this.repo.createQueryBuilder('p')
            .select([
                'p.id',
                'p.name',
                'p.main_image',
                'i.price',
                'i.qty_in_stock'
            ])
            .innerJoin('p.inventory', 'i', 'p.inventory_id = i.id')
            .innerJoinAndSelect('i.category', 'c', 'i.category_id = c.id')
            .innerJoinAndSelect('i.type', 't', 'i.type_id = t.id')
            .leftJoinAndSelect('p.promotion', 'pr', 'pr.product_id = p.id')
            .take(6)
            .getMany();

        if (!products || products.length == 0) {
            throw new HttpException("There is no products available!", HttpStatus.NOT_FOUND)
        }

        return this.reformatPromotedProducts(products);
    }
    
    async filter(filters: any) {
        const query_builder = this.repo.createQueryBuilder('p')
            .innerJoinAndSelect('p.inventory', 'i', 'p.inventory_id = i.id')
            .innerJoinAndSelect('i.category', 'c', 'i.category_id = c.id')
            .innerJoinAndSelect('i.type', 't', 'i.type_id = t.id')
            .leftJoinAndSelect('p.promotion', 'pr', 'pr.product_id = p.id')

        if (filters.query) {
            const formatted_query = filters.query.replace(' ', '%');
            query_builder.andWhere('p.name LIKE :name', { name: `%${formatted_query}%` })
        }
        if (filters.category_id) {
            query_builder.andWhere('i.category_id = :category_id', { category_id: filters.category_id });
        }
        if (filters.type_id) {
            query_builder.andWhere('i.type_id = :type_id', { type_id: filters.type_id });
        }
        if (filters.maximum_price) {
            query_builder.andWhere('i.price < :maximum_price', { maximum_price: filters.maximum_price });
        }
        if (filters.minimum_price) {
            query_builder.andWhere('i.price > :minimum_price', { minimum_price: filters.minimum_price });
        }
        if (filters.size) {
            query_builder.take(filters.size)
            if (filters.page) {
                query_builder.skip((filters.page - 1) * filters.size);
            }
        } else {
            query_builder.take(12)
            if (filters.page) {
                query_builder.skip((filters.page - 1) * 12);
            }
        }

        const count = await query_builder.getCount();
        const products = await query_builder.getMany();
        const promoted_products = this.reformatPromotedProducts(products)
        const images_products = this.reformatSecondaryImagesForMany(promoted_products);

        return this.reformatPages(images_products, count);

    }

    async getNewArrivals() {
        const products = await this.repo.createQueryBuilder('p')
            .select([
                'p.id',
                'p.name',
                'p.main_image',
                'i.price',
                'i.qty_in_stock'
            ])
            .innerJoin('p.inventory', 'i', 'p.inventory_id = i.id')
            .innerJoinAndSelect('i.category', 'c', 'i.category_id = c.id')
            .innerJoinAndSelect('i.type', 't', 'i.type_id = t.id')
            .leftJoinAndSelect('p.promotion', 'pr', 'pr.product_id = p.id')
            .orderBy('p.id', 'DESC')
            .take(6)
            .getMany();

        if (!products || products.length == 0) {
            throw new HttpException("There is no products available!", HttpStatus.NOT_FOUND)
        }

        return this.reformatPromotedProducts(products);
    }

    reformatSecondaryImages(product: Product) {
        const secondary_images: string[] = product.secondary_images.split('||');
        const string_product = JSON.stringify(product);
        const json_product = JSON.parse(string_product);
        json_product.secondary_images = secondary_images;
        return json_product;
    }

    reformatPromotedProducts(products: Product[]) {

        const final_products = [];

        for (let x = 0; x < products.length; x++) {
            const current_product: Product = products.at(x);
            final_products.push(this.reformatPromotedProduct(current_product));
        }

        return final_products;
    }

    reformatPromotedProduct(product: Product) {
        const stringfied = JSON.stringify(product);
        const json_product = JSON.parse(stringfied);
        if (product.promotion) {
            const discount_rate = product.promotion.discount_rate / 100;
            const old_price = product.inventory.price;
            const new_price = old_price - (old_price * discount_rate);
            json_product.new_price = new_price;
        }
        return json_product;
    }

    private reformatPages(products: Product[], count: number, size: number = 12) {
        const json: any = {};
        var pages = Math.floor(count / size);
        if(count % size != 0) {
            pages++;
        }
        json.pages = pages;
        json.products = products;
        return json;
    }

    reformatSecondaryImagesForMany(products: Product[]) {

        const reformed_products = [];

        for (let x = 0; x < products.length; x++) {
            const product = products.at(x);
            reformed_products.push(this.reformatSecondaryImages(product));
        }

        return reformed_products;
    }

}
