import { IsNumber, IsPositive, IsString } from "class-validator";

export class PlaceOrderDto {

    @IsNumber()
    @IsPositive()
    governorate_id: number;
    
    @IsString()
    address_line1: string;

    @IsString()
    address_line2: string;
    
    @IsString()
    building_number: string;

}