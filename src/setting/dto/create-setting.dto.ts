import { LeadsStatus } from 'src/leads/role.enum';
import { IsString } from 'class-validator';

export class CreateSettingDto {
  @IsString()
  bot_token: string;

  bot_username: string;

  bot_chat_id: string;

  path: string;

  status: LeadsStatus;
}
