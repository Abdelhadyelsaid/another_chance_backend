import { User } from "src/model/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    user_type: string;

    @OneToMany(() => User, user => user.user_type)
    users: User[];

}