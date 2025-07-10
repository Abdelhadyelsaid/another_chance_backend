import { ShopOrder } from "src/model/shop_order/entity/shop_order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderStatus {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    status: string;

    @OneToMany(() => ShopOrder, order => order.status)
    orders: ShopOrder[];

}