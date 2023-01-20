import { IsString, IsPhoneNumber, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { LeadsStatus } from '../role.enum';

export class CreateLeadDto {

    @IsString()
    user_id: string;

    @IsString()
    FIO: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    instrument: any;

    comment: string;
}
