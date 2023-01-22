import { IsString } from "class-validator";

export class CreateSupportDto {
    @IsString()
    question: string;

    @IsString()
    user_id: string;

    @IsString()
    message_id: string;
}
