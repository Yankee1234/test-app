export class CreateProductDto {
    name: string;
    price: string;
}

export class BuyProductDto {
    id: number;
}

export class UpdateProductDto {
    id: number;
    name?: string;
    price?: number;
}