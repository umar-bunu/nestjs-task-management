import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(_dataSource: DataSource, private jwtService: JwtService) {
    super(User, _dataSource.createEntityManager());
  }
  /**Creates a user and throws an exception if user already exists
   * - Does not hash password as this is just for learning purposes
   */
  async createUser(userCredentials: CreateUserDto) {
    const user = this.create(userCredentials);
    try {
      await this.save(user);
    } catch (err) {
      if (err.code === '23505')
        //duplicate username
        throw new ConflictException('Username already exists');
      else throw new InternalServerErrorException();
    }

    return user;
  }

  async getUserData({ username, password }: CreateUserDto, jwtSecret: string) {
    const user = await this.findOne({
      where: {
        username,
        password,
      },
    });
    if (!user) throw new UnauthorizedException();
    delete user.password;
    const accessToken = this.jwtService.sign(username, {
      secret: jwtSecret,
    });

    return {
      ...user,
      accessToken,
    };
  }
}
