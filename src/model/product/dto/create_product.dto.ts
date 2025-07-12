import { IsNotEmpty, IsString } from 'class-validator';
import { CreateInventoryDto } from '../../product_inventory/dto/create_inventory.dto';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    main_image: string;

    @IsString()
    @IsNotEmpty()
    secondary_images: string;

    inventory: CreateInventoryDto;
} 