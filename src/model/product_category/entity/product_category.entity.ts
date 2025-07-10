import { ProductInventory } from "src/model/product_inventory/entity/product_category.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    category_name: string;

    @OneToMany(() => ProductInventory, inventory => inventory.category)
    inventories: ProductInventory[];

}