import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { compare, hash } from 'bcryptjs';
import { PasswordResetService } from "src/model/password_reset/password_reset.service";
import { Repository } from "typeorm";
import { EmailService } from "../email/email.service";
import { CreatePaymentDto } from "../user_payment/dto/create_payment.dto";
import { UserPaymentService } from "../user_payment/user_payment.service";
import { UserType } from "../user_type/entity/user_type.entity";
import { SendResetCodeDto } from "./dto/send_reset_code.dto";
import { PutUpdateUserDto } from "./dto/update_all_user_data.dto";
import { PatchUpdateUserDto } from "./dto/update_user_data.dto";
import { UserSignInDto } from "./dto/user_sign_in.dto";
import { UserSignUpDto } from "./dto/user_sign_up.dto";
import { User } from "./entity/user.entity";
import { ResetPasswordDto } from "./dto/reset_password.dto";
import { ConfirmResetCodeDto } from "./dto/confirm_reset_code.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly paymentService: UserPaymentService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly resetService: PasswordResetService
    ) { }

    async signUp(user: UserSignUpDto) {
        const { email, password, first_name, last_name, phone_number } = user;

        const existingUser = await this.userRepo.findOne({ where: { email } });
        if (existingUser) {
            throw new HttpException("Email already exists.", HttpStatus.CONFLICT);
        }

        const hashedPassword = await this.hashPassword(password);

        const insertResults = await this.userRepo.createQueryBuilder('u')
            .insert()
            .into(User)
            .values([{ email, password: hashedPassword, first_name, last_name, phone_number, user_type: { id: 1 }  }])
            .execute();

        if (!insertResults?.raw?.insertId) {
            throw new HttpException("Could not sign up user.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const insertedUser = await this.userRepo.createQueryBuilder('u')
            .select()
            .innerJoinAndSelect('u.user_type', 'ut', 'u.user_type_id = ut.id')
            .where('u.id = :id', { id: insertResults.raw.insertId })
            .getOne();

        if (!insertedUser) {
            throw new HttpException("Failed to retrieve inserted user.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const payload = {
            id: insertedUser.id,
            user_type_id: insertedUser.user_type.id,
            user_type: insertedUser.user_type.user_type
        };

        const authorization_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_TOKEN,
            noTimestamp: true
        });

        const payment = new CreatePaymentDto();
        payment.user_id = insertedUser.id;

        await this.paymentService.createUserPayment(payment);

        return this.reformatUser(insertedUser, authorization_token);
    }

    async signIn(user: UserSignInDto) {
        const { email, password } = user;

        const databaseUser = await this.userRepo.createQueryBuilder('u')
            .select()
            .innerJoinAndSelect('u.user_type', 'ut', 'u.user_type_id = ut.id')
            .where('u.email = :email', { email })
            .getOne();

        if (!databaseUser) {
            throw new HttpException("Email does not exist.", HttpStatus.UNAUTHORIZED);
        }

        const isMatch = await compare(password, databaseUser.password);
        if (!isMatch) {
            throw new HttpException("Wrong password.", HttpStatus.UNAUTHORIZED);
        }

        const payload = {
            id: databaseUser.id,
            user_type_id: databaseUser.user_type.id,
            user_type: databaseUser.user_type.user_type
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_TOKEN,
            noTimestamp: true
        });

        return this.reformatUser(databaseUser, token);
    }

    async checkAuthorization(token: string) {
        try {
            const verified = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_TOKEN
            });

            return !!verified;
        } catch {
            return false;
        }
    }

    async updateAllUserData(body: PutUpdateUserDto, user_id: number) {
        const emailExists = await this.userRepo.findOne({ where: { email: body.email } });

        if (emailExists && emailExists.id !== user_id) {
            throw new HttpException("Email already exists.", HttpStatus.CONFLICT);
        }

        const hashedPassword = await this.hashPassword(body.password);

        const result = await this.userRepo.createQueryBuilder()
            .update(User)
            .set({
                email: body.email,
                password: hashedPassword,
                first_name: body.first_name,
                last_name: body.last_name,
                phone_number: body.phone_number
            })
            .where('id = :user_id', { user_id })
            .execute();

        if (!result.affected) {
            throw new HttpException("Could not update user data!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const updatedUser = await this.userRepo.findOne({
            where: { id: user_id },
            relations: ['user_type']
        });

        const payload = {
            id: user_id,
            user_type_id: updatedUser.user_type.id,
            user_type: updatedUser.user_type.user_type
        };

        return {
            authentication_token: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_TOKEN,
                noTimestamp: true
            })
        };
    }

    async updateUserData(body: PatchUpdateUserDto, user_id: number) {

        const user = await this.userRepo.findOne({
            where: { id: user_id },
            relations: ['user_type']
        });

        if (!user) {
            throw new HttpException("User doesn't exist.", HttpStatus.NOT_FOUND);
        }

        if (body.email) {
            const exists = await this.userRepo.findOne({
                where: { email: body.email }
            });

            if (exists && exists.id !== user_id) {
                throw new HttpException("Email already exists.", HttpStatus.CONFLICT);
            }
        }

        const updated = {
            email: body.email || user.email,
            password: body.password ? await this.hashPassword(body.password) : user.password,
            first_name: body.first_name || user.first_name,
            last_name: body.last_name || user.last_name,
            phone_number: body.phone_number || user.phone_number,
        };

        await this.userRepo.update(user_id, updated);

        const payload = {
            id: user_id,
            user_type_id: user.user_type.id,
            user_type: user.user_type.user_type
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_TOKEN,
            noTimestamp: true
        });

        return this.reformatUser({ ...user, ...updated }, token);
    }

    async makeAdmin(user_id: number) {
        const user_type = new UserType();
        user_type.id = 1;

        const result = await this.userRepo.update(user_id, { user_type });

        if (!result.affected) {
            throw new HttpException("Could not promote user to Admin!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.OK,
            message: "User promoted to admin successfully."
        };
    }

    async sendResetCode(body: SendResetCodeDto) {
        const user = await this.checkIfEmailExists(body.email);
        const code = Math.floor(100000 + Math.random() * 9000).toString();

        await this.emailService.sendPasswordResetCode(body.email, code);
        await this.resetService.create(user.id, code);

        return {
            statusCode: HttpStatus.OK,
            message: "Sent reset code successfully."
        };
    }

    async confirmResetCode(body: ConfirmResetCodeDto) {
        return await this.resetService.confirm(body.code);
    }

    async resetPassword(body: ResetPasswordDto) {
        const code = await this.resetService.findOne(body.email);

        if (code.validated == 0) {
            throw new HttpException("This code was not validated!", HttpStatus.NOT_ACCEPTABLE);
        }

        const updated = await this.userRepo.update(code.user.id, {
            password: await this.hashPassword(body.new_password)
        });

        if (!updated.affected) {
            throw new HttpException("Could not reset password!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        await this.resetService.remove(code.id);

        return {
            statusCode: HttpStatus.OK,
            message: "Password reset successfully."
        };
    }

    async checkIfEmailExists(email: string) {
        const user = await this.userRepo.findOne({ where: { email } });

        if (!user) {
            throw new HttpException("There is no such email.", HttpStatus.NOT_FOUND);
        }

        return user;
    }

    private reformatUser(user: User, token: string) {
        if (!user) {
            throw new Error('User is null in reformatUser');
        }

        const json_user = JSON.parse(JSON.stringify(user));
        json_user.authorization_token = token;
        delete json_user.password;
        delete json_user.updated_at;
        return json_user;
    }

    private async hashPassword(password: string, salt: number = 12) {
        return await hash(password, salt);
    }
}
