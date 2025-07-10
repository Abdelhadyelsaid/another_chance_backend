import { IsEmail, IsNumber, IsPhoneNumber, IsPositive, IsString } from "class-validator";

export class PutUpdateUserDto{

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsPhoneNumber('EG')
    phone_number: string;

}