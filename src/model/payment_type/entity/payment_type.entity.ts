import { UserPayment } from "src/model/user_payment/entity/user_payment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    type: string;

    @OneToMany(() => UserPayment, (payment: UserPayment) => payment.payment_type)
    payments: PaymentType[];

}