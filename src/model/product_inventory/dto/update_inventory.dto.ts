import { IsDecimal, IsNumber, IsPositive, IsString, Matches } from "class-validator";

export class UpdateInventoryDto {

    @IsNumber()
    @IsPositive()
    inventory_id: number;

    @IsNumber()
    @IsPositive()
    category_id: number;

    @IsNumber()
    @IsPositive()
    type_id: number;

    @IsString()
    SKU: string;

    @IsNumber()
    @IsPositive()
    qty_in_stock: number;

    @IsDecimal()
    @Matches('/^(?:d*.d{1,2}|d+)$/')
    price: number;

}