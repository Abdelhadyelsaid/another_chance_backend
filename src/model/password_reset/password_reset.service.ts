import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/user/entity/user.entity';
import { Repository } from 'typeorm';
import { PasswordReset } from './entity/password_reset.entity';

@Injectable()
export class PasswordResetService {

    constructor(@InjectRepository(PasswordReset) private readonly repo: Repository<PasswordReset>) { }

    async create(user_id: number, code: string) {

        const user = new User();
        user.id = user_id;

        const results = await this.repo.createQueryBuilder()
            .insert()
            .into(PasswordReset)
            .values([
                {
                    user: user,
                    code: code
                }
            ])
            .execute();

        if (!results) {
            throw new HttpException("Could not store reset code for the user!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return results;
    }

    async confirm(code: string) {

        const results = await this.repo.createQueryBuilder('code')
            .select()
            .innerJoinAndSelect('code.user', 'user', 'user.id = code.user_id')
            .where('code.code = :code', { code: code })
            .orderBy('code.id', 'DESC')
            .getOne();

        if (!results) {
            throw new HttpException("The code either does not exist or has expired!", HttpStatus.NOT_FOUND);
        }

        const validate = await this.repo.createQueryBuilder()
            .update()
            .set({ validated: 1 })
            .where('id = :id', { id: results.id })
            .execute();

        if (!validate) {
            throw new HttpException("Could not validate the reset code!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.ACCEPTED,
            message: "Reset Code Validated Successfuly."
        };
    }

    async findOne(email: string) {

        const code = await this.repo.createQueryBuilder('code')
            .select()
            .innerJoinAndSelect('code.user', 'user', 'user.id = code.user_id')
            .where('user.email = :email', { email: email })
            .orderBy('code.id', 'DESC')
            .getOne();

            console.log(code);
        if (!code) {
            throw new HttpException("This reset code does not exist!", HttpStatus.NOT_FOUND);
        }

        return code;
    }

    async remove(code_id: number) {

        const results = this.repo.createQueryBuilder()
            .delete()
            .from(PasswordReset)
            .where('id = :id', { id: code_id })
            .execute();

        if (!results) {
            throw new HttpException("Could not delete user reset code!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return results;
    }

}
