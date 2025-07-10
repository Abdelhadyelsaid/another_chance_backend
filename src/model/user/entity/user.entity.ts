import { PasswordReset } from "src/model/password_reset/entity/password_reset.entity";
import { ShopOrder } from "src/model/shop_order/entity/shop_order.entity";
import { ShoppingCart } from "src/model/shopping_cart/entity/shopping_cart.entity";
import { UserAddress } from "src/model/user_address/entity/user_address.entity";
import { UserPayment } from "src/model/user_payment/entity/user_payment.entity";
import { UserType } from "src/model/user_type/entity/user_type.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    email: string;

    @Column({
        nullable: false,
    })
    password: string;

    @Column({
        nullable: false,
    })
    first_name: string;

    @Column({
        nullable: false,
    })
    last_name: string;

    @Column({
        nullable: false,
    })
    phone_number: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => UserAddress, address => address.user)
    addresses: UserAddress[];

    @OneToMany(() => UserPayment, payment => payment.user)
    payments: UserPayment[];

    @ManyToOne(() => UserType, user_type => user_type.users)
    @JoinColumn({ name: 'user_type_id' })
    user_type: UserType;

    @OneToMany(() => ShopOrder, order => order.user)
    orders: ShopOrder[];

    @OneToMany(() => ShoppingCart, cart => cart.user)
    carts: ShoppingCart[];

    @OneToOne(() => PasswordReset, password_reset => password_reset.user)
    password_reset: PasswordReset;

}