import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class UserSignUpDto{

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