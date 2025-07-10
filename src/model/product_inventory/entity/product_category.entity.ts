import { CategoryType } from "src/model/category_type/entity/category_type.entity";
import { Product } from "src/model/product/entity/product.entity";
import { ProductCategory } from "src/model/product_category/entity/product_category.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductInventory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    SKU: string;

    @Column({
        nullable: false
    })
    qty_in_stock: number;

    @Column({
        nullable: false
    })
    price: number;

    @OneToOne(() => Product, product => product.inventory)
    product: Product;

    @OneToOne(() => CategoryType, type => type.inventory)
    @JoinColumn({ name: 'type_id' })
    type: CategoryType;

    @ManyToOne(() => ProductCategory, category => category.inventories)
    @JoinColumn({ name: 'category_id' })
    category: ProductCategory;

}