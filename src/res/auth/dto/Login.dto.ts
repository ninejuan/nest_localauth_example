import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: "유저 id",
        example: "ninejuan"
    })
    id: string;

    @ApiProperty({
        description: "유저 pw",
        example: "examplePW"
    })
    pw: string;
}