// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../interface/jwt-payload.interface';
import { CreateAuthDto } from './dto/createUser.dto';
import userSchema from 'src/models/user.schema';
import { readFile } from 'fs/promises';
import { UpdateAssociationDto } from './dto/updateAssociation.dto';
import { UpdateNicknameDto } from './dto/updateNickname.dto';
import { UpdateDescriptionDto } from './dto/updateDesc.dto';
import { LoginDto } from './dto/Login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async validateUser(id: string, password: string): Promise<any> {
    console.log('a')
    const user = await userSchema.findOne({ nxpid: id });
    console.log(user);
    if (user && user.nxppw == password) {
      console.log('h')
      const { nxppw, ...result } = user;
      return result;
    } else {
      console.log('b')
      return null;
    }
  }

  async login(user: LoginDto) {
    const validate = this.validateUser(user.id, user.pw);
    if (!validate) return null;

    const payload: JwtPayload = { id: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(userData: CreateAuthDto) {
    const newUser = await new userSchema({
      nxpid: userData.id,
      nxppw: userData.pw,
      nickname: userData.nickname ?? userData.id,
      mailaddr: userData.email
    }).save();
    return {
      result: userData.id ?? null
    };
  }

  async getImage(filename: string) {
    const imgBuffer = await readFile(`./upload/${filename}`);
    return imgBuffer.buffer;
  }

  async profile(userid: string) {
    const user = await userSchema.findOne({ nxpid: userid });
    return user ?? null;
  }

  async profilePhoto(imgFileName: string, userid: string) {
    const user = await userSchema.findOne({ nxpid: userid });
    let res = false;
    if (user) {
      user.profilePhoto = imgFileName;
      await user.save().then(() => {
        res = true;
      }).catch((e) => {
        res = false
      });
    } else res = false;
    return {
      result: res
    };
  }

  async updateAssociation(data: UpdateAssociationDto) {
    const user = await userSchema.findOne({ nxpid: data.id });
    user.associated = data.association; await user.save();
    return { result: true };
  }

  async updateNickname(data: UpdateNicknameDto) {
    const user = await userSchema.findOne({ nxpid: data.id });
    user.nickname = data.nickname; await user.save();
    return { result: true };
  }

  async updateDescription(data: UpdateDescriptionDto) {
    const user = await userSchema.findOne({ nxpid: data.id });
    user.description = data.description; await user.save();
    return { result: true };
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    await this.userService.setRefreshToken(id, refreshToken);
  }

  async logout(id: string) {
    await this.userService.removeRefreshToken(id);
  }

  async refreshToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken);
    const user = await this.userService.findOne(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { id: user.nxpid };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userService.setRefreshToken(user.nxpid.toString(), newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
