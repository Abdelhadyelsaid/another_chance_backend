import { IsNumber, IsPositive } from "class-validator";

export class UpdateOrderStatusDto {

    @IsNumber()
    @IsPositive()
    order_id: number;
    
    @IsNumber()
    @IsPositive()
    status_id: number;

}