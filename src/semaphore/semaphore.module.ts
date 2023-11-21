import { Module } from '@nestjs/common';
import { SemaphoreService } from './semaphore.service';
import { SemaphoreController } from './semaphore.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtSecretKeyTMP } from 'src/auth/jwt.strategy';

@Module({
  imports: [
  PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  JwtModule.register({
    secret: JwtSecretKeyTMP,
    signOptions: { expiresIn: '3h' },
  }),],
  controllers: [SemaphoreController],
  providers: [SemaphoreService],
})
export class SemaphoreModule {}
