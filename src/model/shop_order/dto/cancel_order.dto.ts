import { IsNumber, IsPositive } from "class-validator";

export class CancelOrderDto {

    @IsNumber()
    @IsPositive()
    order_id: number;

}