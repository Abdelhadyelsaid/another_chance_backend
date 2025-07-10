import { ShopOrder } from "src/model/shop_order/entity/shop_order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShippingMethod {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    name: string;

    @Column({
        nullable: false
    })
    price: number;

    @OneToMany(() => ShopOrder, order => order.shipping)
    orders: ShopOrder[];
    
}