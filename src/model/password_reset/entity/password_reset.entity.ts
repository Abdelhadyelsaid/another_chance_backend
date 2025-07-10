import { User } from "src/model/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PasswordReset {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    code: string;

    @Column({ nullable: false })
    validated: number;

    @CreateDateColumn()
    created_at: Date;

    @OneToOne(() => User, user => user.password_reset)
    @JoinColumn({ name: 'user_id' })
    user: User;

}