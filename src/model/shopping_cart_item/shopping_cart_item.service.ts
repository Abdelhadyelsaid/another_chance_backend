import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCartItem } from './entity/shopping_cart_item.entity';
import { AddToCartDto } from './dto/add_to_cart.dto';
import { ShoppingCart } from '../shopping_cart/entity/shopping_cart.entity';
import { Product } from '../product/entity/product.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class ShoppingCartItemService {

    constructor(
        @InjectRepository(ShoppingCartItem) readonly itemsRepo: Repository<ShoppingCartItem>,
        @InjectRepository(ShoppingCart) readonly cartRepo: Repository<ShoppingCart>
    ) { }

    async create(body: AddToCartDto, user_id: number) {
        const cart_item = await this.itemsRepo.createQueryBuilder('item')
            .select()
            .innerJoinAndSelect('item.cart', 'cart', 'item.cart_id = cart.id')
            .innerJoinAndSelect('item.product', 'product', 'item.product_id = product.id')
            .innerJoinAndSelect('product.inventory', 'inventory', 'inventory.id = product.inventory_id')
            .where('cart.user_id = :user_id', { user_id: user_id })
            .andWhere('item.product_id = :product_id', { product_id: body.product_id })
            .getOne()

            
        if (cart_item) {

            if ((cart_item.quantity + 1) > cart_item.product.inventory.qty_in_stock) {
                throw new HttpException("The quantity required is more than the quantity in stock!", HttpStatus.NOT_ACCEPTABLE);
            }

            const cart = cart_item.cart;
            const product = cart_item.product;
            const quantity = cart_item.quantity + 1;
            const results = await this.itemsRepo.createQueryBuilder()
                .update()
                .set(
                    { cart: cart, product: product, quantity: quantity }
                )
                .where('id = :id', { id: cart_item.id })
                .execute()

            if (!results) {
                throw new HttpException("Could not update product in cart!", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            return {
                statusCode: HttpStatus.CREATED,
                message: "Updated product in cart successfuly."
            }
        } else {

            const existing_cart = await this.cartRepo.createQueryBuilder()
                .select()
                .where('user_id = :user_id', { user_id: user_id })
                .getOne()

            if (existing_cart) {
                const product = new Product();
                product.id = body.product_id;

                const query_builder = this.itemsRepo.createQueryBuilder()
                    .insert()
                    .into(ShoppingCartItem)

                if (body.quantity) {
                    query_builder.values([
                        { cart: existing_cart, product: product, quantity: body.quantity }
                    ])
                } else {
                    query_builder.values([
                        { cart: existing_cart, product: product, quantity: 1 }
                    ])
                }

                const results = await query_builder.execute()

                if (!results) {
                    throw new HttpException("Could not add product to cart!", HttpStatus.INTERNAL_SERVER_ERROR);
                }

                return {
                    statusCode: HttpStatus.CREATED,
                    message: "Added product to cart successfuly."
                }
            } else {
                const user = new User();
                user.id = user_id;

                const insert_cart = await this.cartRepo.createQueryBuilder()
                .insert()
                .into(ShoppingCart)
                .values([
                    { user: user }
                ])
                .execute()

                if (!insert_cart) {
                    throw new HttpException("Could not create cart!", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                
                const cart = new ShoppingCart();
                const product = new Product();
                cart.id = insert_cart.raw.insertId;
                product.id = body.product_id;

                const query_builder = this.itemsRepo.createQueryBuilder()
                    .insert()
                    .into(ShoppingCartItem)

                if (body.quantity) {
                    query_builder.values([
                        { cart: cart, product: product, quantity: body.quantity }
                    ])
                } else {
                    query_builder.values([
                        { cart: existing_cart, product: product, quantity: 1 }
                    ])
                }

                const results = await query_builder.execute()

                if (!results) {
                    throw new HttpException("Could not add product to cart!", HttpStatus.INTERNAL_SERVER_ERROR);
                }

                return {
                    statusCode: HttpStatus.CREATED,
                    message: "Added product to cart successfuly."
                }
            }
        }
    }
    
    async remove(item_id: number, user_id: any) {
        
        const exists_for_user = await this.cartRepo.createQueryBuilder('cart')
        .select()
        .innerJoinAndSelect('cart.items', 'item', 'cart.id = item.cart_id')
        .where('cart.user_id = :user_id', { user_id: user_id })
        .andWhere('item.id = :id', { id: item_id })
        .getOne()

        if(!exists_for_user) {
            throw new HttpException("This item id does not belong to the user!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const results = await this.itemsRepo.createQueryBuilder()
        .delete()
        .from(ShoppingCartItem)
        .where('id = :id', { id: item_id })
        .execute()

        if(!results) {
            throw new HttpException("Could not remove this item from cart!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: "Removed from cart successfuly."
        }
    }
}
