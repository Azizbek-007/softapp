import { IsString, IsNumber, IsOptional } from 'class-validator'
export class CreateInstrumentDto {

    @IsString()
    name: string;

    @IsNumber()
    price: number;

    link: string;

    code: string;

}
