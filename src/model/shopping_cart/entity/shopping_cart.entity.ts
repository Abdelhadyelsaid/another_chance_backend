import { ShoppingCartItem } from "src/model/shopping_cart_item/entity/shopping_cart_item.entity";
import { User } from "src/model/user/entity/user.entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShoppingCart {
 
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.carts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => ShoppingCartItem, item => item.cart)
    items: ShoppingCartItem[];
}