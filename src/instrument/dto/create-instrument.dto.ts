import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator'
import { InstrumentTypeEnum } from '../intrument.enum';
export class CreateInstrumentDto {

    @IsString()
    name: string;

    @IsNumber()
    price: number;

    link: string;

    code: string;

    @IsEnum(InstrumentTypeEnum)
    type: InstrumentTypeEnum; 
}
