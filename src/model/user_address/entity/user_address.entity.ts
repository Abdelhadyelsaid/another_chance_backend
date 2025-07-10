import { Governorate } from "src/model/governorate/entity/governorate.entity";
import { ShopOrder } from "src/model/shop_order/entity/shop_order.entity";
import { User } from "src/model/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserAddress {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    address_line1: string;


    @Column({
        nullable: true
    })
    address_line2: string;


    @Column({
        nullable: false
    })
    building_number: string;

    @ManyToOne(() => User, user => user.addresses)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Governorate, governorate => governorate.addresses)
    @JoinColumn({ name: 'governorate_id' })
    governorate: Governorate;

    @OneToMany(() => ShopOrder, order => order.address)
    orders: ShopOrder[];

}