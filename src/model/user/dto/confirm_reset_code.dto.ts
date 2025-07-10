import { IsEmail, IsString } from "class-validator";

export class ConfirmResetCodeDto {

    @IsString()
    code: string;

}