import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
    @ApiProperty({
        description: "유저의 id입니다. 가입 시 사용합니다.",
        example: "ninejuan"
    })
    id!: string;

    @ApiProperty({
        description: "유저의 비밀번호입니다.",
        example: "examplePW"
    })
    pw!: string;

    @ApiProperty({
        description: "유저의 닉네임입니다. (기본값 : 유저 id)",
        example: "나인주안"
    })
    nickname: string;

    @ApiProperty({
        description: "유저의 이메일 주소입니다. (이메일 인증 필요)",
        example: "hello.world@octive.net"
    })
    email!: string;
}