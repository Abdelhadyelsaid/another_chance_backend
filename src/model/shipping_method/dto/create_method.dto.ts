import { IsDecimal, IsNumber, IsPositive, IsString, Matches } from "class-validator";

export class CreateMethodDto {

    @IsString()
    name: string;

    @IsDecimal()
    @Matches(/^(?!^0\.00$)(([1-9][\d]{0,6})|([0]))\.[\d]{2}$/, { message: "The price format is invalid. 1- The price must have two decimal places. 2- The price value must not be zero such as (0 , 00.00 , 0.00). 3- The price should not be more than 7 digits without the 2 places. 4- If the price value has two digits or more it cannot start with 0 such as (01.00 , 0100.50 , 029.99)." })
    price: number;

}