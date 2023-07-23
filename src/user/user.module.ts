import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from './user.controller';
import { UserRepository } from './user.resporitory';
import { UserService } from './user.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: 3_600, //1 hour
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UserModule {}
