import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveType, User, UserType } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async createUser(
    createUserDto: CreateUserDto,
    userType: number,
  ): Promise<User> {
    const user: User = new User();

    user.email = createUserDto.email;
    user.user_type = userType;
    user.is_active = ActiveType.Active;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('12345678', salt);
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }

  async forgotPasswordUser(
    user_id: number,
    hashedPassword: string
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id: user_id,
    });

    user.password = hashedPassword;

    return await this.userRepository.save(user);
  }

  async createNewUser(
    createUserDto: CreateUserDto,
    userType: number,
  ): Promise<User> {
    const user: User = new User();

    user.email = createUserDto.email;
    user.user_type = userType;
    user.is_active = ActiveType.Active;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  async findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  async viewUser(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async deactivateUser(id: number): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    user.is_active = 0;

    return await this.userRepository.save(user);
  }

  async activateUser(id: number): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    user.is_active = 1;

    return await this.userRepository.save(user);
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async updateUser(id: number, email: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    user.email = email;

    return await this.userRepository.save(user);
  }

  async updatePassword(userId: number, newPassword: string): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;

    return await this.userRepository.save(user);
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  async removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}
