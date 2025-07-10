import { IsEmail, IsString } from "class-validator";

export class SendResetCodeDto {

    @IsString()
    @IsEmail()
    email: string;

}