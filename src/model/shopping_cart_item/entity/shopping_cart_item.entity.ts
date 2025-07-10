import { Product } from "src/model/product/entity/product.entity";
import { ShoppingCart } from "src/model/shopping_cart/entity/shopping_cart.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShoppingCartItem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    quantity: number;

    @ManyToOne(() => ShoppingCart, cart => cart.items)
    @JoinColumn({ name: 'cart_id' })
    cart: ShoppingCart;

    @OneToOne(() => Product, product => product.cart_item)
    @JoinColumn({ name: 'product_id' })
    product: Product;

}