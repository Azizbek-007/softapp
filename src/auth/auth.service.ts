import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createAuthDto.password, salt);
    const new_user = this.UserRepository.create({
      username: createAuthDto.username,
      salt,
      password,
    });

    try {
      await new_user.save();
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(loginAuthDto: CreateAuthDto): Promise<{ accessToken: string }> {
    const { username, password } = loginAuthDto;
    const user = await this.UserRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
