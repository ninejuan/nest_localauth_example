import { ApiProperty } from '@nestjs/swagger';

export class UpdateAssociationDto {
    @ApiProperty({
        description: "유저의 id입니다. 가입 시 사용합니다.",
        example: "ninejuan"
    })
    id!: string;

    @ApiProperty({
        description: "유저의 새로운 소속입니다.",
        example: "Sketter"
    })
    association: string;
}