import { ApiProperty } from '@nestjs/swagger';

export class UpdateDescriptionDto {
    @ApiProperty({
        description: "유저의 id입니다.",
        example: "ninejuan"
    })
    id!: string;

    @ApiProperty({
        description: "유저의 새로운 소개글입니다.",
        example: "안녕하세요, 선린인터넷고 소프트웨어과 이주안입니다."
    })
    description!: string;
}