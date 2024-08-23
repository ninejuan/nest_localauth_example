import { Injectable } from '@nestjs/common';
import userSchema from './models/user.schema';

@Injectable()
export class AppService {
  constructor( ) { }
  async getDefaultMainPage() {
    return "Not Authenticated";
  }
 
  async getUserMainPage(userid: string) {
    return "Authenticated"
  }
}
