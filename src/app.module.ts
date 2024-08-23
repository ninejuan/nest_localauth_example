import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './res/auth/auth.module';
import { UserModule } from './res/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
 config();

const env = process.env;

@Module({
  imports: [AppModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    // configure(consumer: MiddlewareConsumer) {
    //   consumer.apply(LoggerMiddleware).forRoutes('*');
    // }
}
