import { IsString, IsPhoneNumber, IsEnum, IsNumber } from 'class-validator';
import { Instrument } from 'src/instrument/entities/instrument.entity';
import { LeadsStatus } from '../role.enum';

export class CreateLeadDto {

    @IsString()
    user_id: string;

    @IsString()
    FIO: string;

    phone: string;

    @IsEnum(LeadsStatus)
    status: LeadsStatus;

    @IsNumber()
    instrument: Instrument;

    comment: string;
}
