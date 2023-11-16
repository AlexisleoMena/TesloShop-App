import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToDto } from 'src/common/utils/helpers/transform-helper';
import { UserResponse } from './dto/user-response.dto';
import { PayloadToken } from 'src/auth/interfaces/token.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = this.userRepository.create(createUserDto);
      const user = await this.userRepository.save(createdUser);
      return plainToDto(UserResponse, user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
    });

    return users.map((user) => plainToDto(UserResponse, user));
  }

  async findOne(id: number) {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`Product with ${id} not found.`);
    return plainToDto(UserResponse, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.userRepository.save(user);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBErrors(error);
    }
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return this.userRepository.remove(user);
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      select: ['id', 'password', 'role'],
      where: { email },
    });
  }

  async findByRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<PayloadToken> {
    const user = await this.userRepository.findOne({
      select: ['id', 'refreshToken', 'role'],
      where: { id: userId },
    });

    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const isRefreshTokenMatching = await bcrypt.compare(
      hash,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return { id: user.id, role: user.role };
    }
  }

  async updateRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const currentHashedRefreshToken = bcrypt.hashSync(hash, 10);

    await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  removeRefreshToken(userId: number) {
    return this.userRepository.update({ id: userId }, { refreshToken: null });
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
