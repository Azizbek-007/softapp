import { IsString, IsPhoneNumber, IsEnum } from 'class-validator';
import { LeadsStatus } from '../role.enum';

export class CreateLeadDto {

    @IsString()
    user_id: string;

    @IsString()
    FIO: string;

    @IsPhoneNumber('UZ')
    phone: string;

    @IsString()
    utm: string;

    @IsEnum(LeadsStatus)
    status: LeadsStatus;
}
