import { IsBoolean, IsDateString, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdatePaymentDto{

    @IsNumber()
    @IsPositive()
    payment_id: number;

    @IsNumber()
    @IsPositive()
    payment_type_id: number;

    @IsString()
    provider: string;

    @IsNumber()
    @IsPositive()
    account_number: number;

    @IsDateString({ strict: false, strictSeparator: false })
    expiry_date: string;

    @IsBoolean()
    @IsOptional()
    is_default: boolean = false;

}