import { IsDateString, IsDecimal, IsNumber, IsPositive, IsString, Matches } from "class-validator";
import { Product } from "src/model/product/entity/product.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export class CreatePromotionDto {

    @IsNumber()
    @IsPositive()
    product_id: number;

    @IsString()
    name: string;
    
    @IsString()
    description: string;
    
    @IsDecimal()
    @Matches(/\b(?<!\.)(?!0+(?:\.0+)?%)(?:\d|[1-9]\d|100)(?:(?<!100)\.\d+)?$/, { message: "1- Discount rate must be between 0 and 100. 2- Discount rate may have 2 decimal places except (100). 3- You can set either 0 decimal places such as (20, 35, 70, 100) or set 2 decimal places such as (20.55, 71.90, 65.50). 4- Discount rate could be zero such as (0, 0.00)." })
    discount_rate: number;
    
    @IsDateString({ strict: false, strictSeparator: false })
    start_date: Date;

    @IsDateString({ strict: false, strictSeparator: false })
    end_date: Date;

}