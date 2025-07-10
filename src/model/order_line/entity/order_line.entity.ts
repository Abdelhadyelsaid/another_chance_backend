import { Product } from "src/model/product/entity/product.entity";
import { ShopOrder } from "src/model/shop_order/entity/shop_order.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderLine {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    quantity: number;
    
    @Column({ nullable: false })
    price: number;

    @OneToOne(() => Product, product => product.order_line)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ShopOrder, order => order.order_lines)
    @JoinColumn({ name: 'order_id' })
    order: ShopOrder;

}