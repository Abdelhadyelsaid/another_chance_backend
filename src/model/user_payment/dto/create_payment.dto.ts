import { IsBoolean, IsDateString, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreatePaymentDto{
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    user_id: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    payment_type_id: number = 4;
    
    @IsOptional()
    @IsString()
    provider: string = "Cash";
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    account_number: number = 0;
    
    @IsOptional()
    @IsDateString({ strict: false, strictSeparator: false })
    expiry_date: string = "2060-01";
    
    @IsOptional()
    @IsBoolean()
    is_default: boolean = true;

}