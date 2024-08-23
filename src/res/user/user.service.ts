// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import User from 'src/interface/user.interface';
import userSchema from 'src/models/user.schema';

@Injectable()
export class UserService {
  async findOne(id: string): Promise<User | undefined> {
    const user = await userSchema.findOne({ nxpid: id });
    return user;
  }

  async setRefreshToken(id: string, refreshToken: string) {
    const user = await userSchema.findOne({ nxpid: id });
    if (user) {
      user.refreshToken = refreshToken;
      await user.save();
    }
  }

  async removeRefreshToken(id: string) {
    const user = await userSchema.findOne({ nxpid: id });
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
  }
}
