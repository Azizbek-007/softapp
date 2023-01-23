import { IsArray, IsOptional, IsString } from "class-validator";

export class SendMessageDto {

    @IsString()
    message: string

    @IsOptional()
    user_id: string
}