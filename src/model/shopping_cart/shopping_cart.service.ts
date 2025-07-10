import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCart } from './entity/shopping_cart.entity';

@Injectable()
export class ShoppingCartService {

    constructor(@InjectRepository(ShoppingCart) readonly repo: Repository<ShoppingCart>) { }

    async findOne(user_id: number) {
        const cart = await this.repo.createQueryBuilder('cart')
        .select([
            'cart.id',
            'item.id',
            'item.quantity',
            'product.name',
            'product.main_image',
            'inventory.price',
            'inventory.qty_in_stock',
        ])
        .innerJoin('cart.items', 'item', 'cart.id = item.cart_id')
        .innerJoin('item.product', 'product', 'product.id = item.product_id')
        .innerJoin('product.inventory', 'inventory', 'inventory.id = product.inventory_id')
        .where('cart.user_id = :user_id', { user_id: user_id })
        .getOne()

        if(!cart){
            throw new HttpException("This user has no cart.", HttpStatus.NO_CONTENT)
        }

        return cart;
    }

}
