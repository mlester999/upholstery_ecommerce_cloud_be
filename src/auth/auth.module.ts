import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtSecretKeyTMP, JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from 'src/app.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  providers: [UserService, AppService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
