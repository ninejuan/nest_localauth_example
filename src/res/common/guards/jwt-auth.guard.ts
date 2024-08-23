// src/auth/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/res/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService, private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const isValid = await super.canActivate(context);
    
    if (!isValid) {
      throw new UnauthorizedException();
    }

    const user = request.user;
    const payload = { id: user.id };
    request.id = user.id;

    // Frontend에서 401 뜨면 interceptor로 감지해서 /refresh endpoint로 요청 날려서 acToken 발급받기
    // const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    // await this.authService.updateRefreshToken(user.id, newRefreshToken);

    // response.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    // });

    return payload;
  }
}
