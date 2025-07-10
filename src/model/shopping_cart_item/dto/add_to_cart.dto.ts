import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class AddToCartDto {
    
    @IsNumber()
    @IsPositive()
    product_id: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    quantity: number;

}