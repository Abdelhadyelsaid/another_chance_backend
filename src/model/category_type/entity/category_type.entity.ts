import { ProductInventory } from "src/model/product_inventory/entity/product_category.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CategoryType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    type: string;

    @OneToOne(() => ProductInventory, inventory => inventory.type)
    inventory: ProductInventory;

}