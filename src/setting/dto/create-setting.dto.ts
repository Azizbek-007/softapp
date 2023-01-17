import { LeadsStatus } from "src/leads/role.enum";
import { IsString } from 'class-validator';

export class CreateSettingDto {

    @IsString()
    bot_token: string;

    path: string;

    status: LeadsStatus;   
}
