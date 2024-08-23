// src/auth/auth.controller.ts
import { Request, Controller, Post, UseGuards, Res, Body, UploadedFile, Req, Param, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Response } from 'express';
import { CreateAuthDto } from './dto/createUser.dto';
import * as multer from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as crypto from 'crypto';
import * as path from 'path';
import { UpdateAssociationDto } from './dto/updateAssociation.dto';
import { UpdateNicknameDto } from './dto/updateNickname.dto';
import { UpdateDescriptionDto } from './dto/updateDesc.dto';
import { LoginDto } from './dto/Login.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload');
  },
  filename: (req, file, cb) => {
    const userid = req.body.id;
    const ext = path.extname(`${file.originalname}`);
    console.log(ext)
    // const ext = path.extname(file.originalname);
    const filename = `${userid}-profile-${crypto.randomBytes(16).toString('hex')}${ext}`
    cb(null, filename);
  }
});

const uploadOptions: MulterOptions = {
  storage: storage
};

@ApiTags("Authentication")
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({
    summary: "로그인",
    description: "사용자의 계정으로 로그인합니다."
  })
  @ApiResponse({
    status: 200,
    description: "로그인 성공",
    schema: {
      properties: {
        accessToken: {
          type: 'String',
          description: "로그인한 유저의 AccessToken입니다.",
          example: "asfoiu43h7rvfud=;"
        }
      }
    }
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req, @Res() res: Response) {
    const result = await this.authService.login(loginDto);
    if (!result) throw new UnauthorizedException();
    else {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      });

      return res.json({ accessToken: result.accessToken });
    }
  }

  @ApiOperation({
    summary: "회원가입",
    description: "새로운 계정을 생성합니다."
  })
  @ApiResponse({
    status: 200,
    description: "회원가입 성공",
    schema: {
      properties: {
        userId: {
          type: 'String',
          description: "가입된 유저의 ID입니다.",
          example: "ninejuan"
        }
      }
    }
  })
  @Post('register')
  async register(@Body() bd: CreateAuthDto) {
    return this.authService.register(bd);
  }

  @ApiOperation({
    summary: "프로필사진 업로드",
    description: "유저의 프로필 사진을 등록합니다."
  })
  @ApiResponse({
    status: 200,
    description: "유저 프로필 사진 데이터",
  })
  @ApiParam({
    name: "id",
    example: "ninejuan",
    required: true
  })
  @Post('profilePhoto/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async profilePhoto(@UploadedFile() file: Express.Multer.File, @Param('id') userid: string) {
    console.log(file);
    return this.authService.profilePhoto(file.filename, userid);
  }

  @ApiOperation({
    summary: "프로필 조회",
    description: "유저의 프로필을 조회합니다."
  })
  @ApiResponse({
    status: 200,
    description: "유저 데이터",
  })
  @ApiParam({
    name: "id",
    example: "ninejuan",
    required: true
  })
  @Post('profile/:id')
  async profile(@Param('id') id: string) {
    return this.authService.profile(id);
  }

  @ApiOperation({
    summary: "refreshToken 재발급",
    description: "refreshToken을 갱신합니다."
  })
  @ApiResponse({
    status: 200,
    description: "유저 액세스 토큰 데이터",
    schema: {
      properties: {
        accessToken: {
          type: 'String',
          description: "유저의 새로운 accessToken입니다.",
          example: "rhiouerfho8v7reni="
        }
      }
    }
  })
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string, @Res() res: Response) {
    const tokens = await this.authService.refreshToken(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return res.json({ accessToken: tokens.accessToken });
  }

  @ApiOperation({
    summary: "로그아웃",
    description: "refToken, acToken을 초기화하고 로그아웃합니다."
  })
  @ApiResponse({
    status: 200,
    description: "유저 액세스 토큰 데이터",
    schema: {
      properties: {
        accessToken: {
          type: 'String',
          description: "유저의 새로운 accessToken입니다.",
          example: "rhiouerfho8v7reni="
        }
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Res() res: Response) {
    await this.authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out successfully' });
  }

  @ApiOperation({
    summary: "소속 학교/회사 변경",
    description: "유저의 소속 학교/회사 정보를 변경합니다."
  })
  @ApiResponse({
    status: 200,
    description: "변경 결과",
    schema: {
      properties: {
        result: {
          type: 'Boolean',
          description: "변경 결과입니다 (True / False)",
          example: true
        }
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  @Post('update/association')
  async updateAssociation(@Body() bd: UpdateAssociationDto) {
    return this.authService.updateAssociation(bd);
  }

  @ApiOperation({
    summary: "닉네임 변경",
    description: "유저의 닉네임 정보를 변경합니다."
  })
  @ApiResponse({
    status: 200,
    description: "변경 결과",
    schema: {
      properties: {
        result: {
          type: 'Boolean',
          description: "변경 결과입니다 (True / False)",
          example: true
        }
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  @Post('update/nickname')
  async updateNickname(@Body() bd: UpdateNicknameDto) {
    return this.authService.updateNickname(bd);
  }

  @ApiOperation({
    summary: "소개글 변경",
    description: "유저의 소개글 정보를 변경합니다."
  })
  @ApiResponse({
    status: 200,
    description: "변경 결과",
    schema: {
      properties: {
        result: {
          type: 'Boolean',
          description: "변경 결과입니다 (True / False)",
          example: true
        }
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  @Post('update/description')
  async updateDescription(@Body() bd: UpdateDescriptionDto) {
    return this.authService.updateDescription(bd);
  }
}
