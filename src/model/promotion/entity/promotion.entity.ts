import { Product } from "src/model/product/entity/product.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Promotion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;
    
    @Column({ nullable: false })
    description: string;
    
    @Column({ nullable: false })
    discount_rate: number;
    
    @Column({ nullable: false })
    start_date: Date;

    @Column({ nullable: false })
    end_date: Date;

    @OneToOne(() => Product, product => product.promotion)
    @JoinColumn({ name: 'product_id' })
    product: Product;

}