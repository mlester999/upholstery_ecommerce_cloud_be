import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { User, UserType } from 'src/user/entities/user.entity';

@Injectable()
export class AdminService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  /**
   * this is function is used to create Admin in Admin Entity.
   * @param createAdminDto this will type of createAdminDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of admin
   */
  async createAdmin(
    createAdminDto: CreateAdminDto,
    user: User,
  ): Promise<Admin> {
    const admin: Admin = new Admin();

    admin.user = user;
    admin.first_name = createAdminDto.first_name;
    admin.middle_name = createAdminDto.middle_name;
    admin.last_name = createAdminDto.last_name;
    admin.gender = createAdminDto.gender;
    admin.contact_number = createAdminDto.contact_number;

    return this.adminRepository.save(admin);
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  async findAllAdmin(): Promise<Admin[]> {
    return this.adminRepository.find({
      where: { user: { user_type: UserType.Admin } },
      relations: {
        user: true,
      },
    });
  }

  async findById(id: number): Promise<Admin | undefined> {
    return this.adminRepository.findOne({
      where: { id, user: { user_type: UserType.Admin } },
      relations: {
        user: true,
      },
    });
  }

  async findByAdminId(id: number): Promise<Admin | undefined> {
    return this.adminRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  async findByEmail(email: string): Promise<Admin | undefined> {
    return this.adminRepository.findOne({
      where: { user: { email, user_type: UserType.Admin } },
      relations: {
        user: true,
      },
    });
  }

  async findByContactNumber(contact_number: string): Promise<Admin | undefined> {
    return this.adminRepository.findOne({
      where: { contact_number },
    });
  }

  async findByIdAuth(id: number): Promise<Admin | undefined> {
    return this.adminRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  async findByEmailAuth(email: string): Promise<Admin | undefined> {
    return this.adminRepository.findOne({
      where: { user: { email } },
      relations: {
        user: true,
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  async viewAdmin(id: number): Promise<Admin> {
    return this.adminRepository.findOneBy({
      id,
      user: { user_type: UserType.Admin },
    });
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async updateAdmin(body: any): Promise<Admin> {
    const admin = await this.viewAdmin(body.details.id);

    if (!admin) {
      throw new NotFoundException(`Admin not found`);
    }

    if (Object.keys(body.details).length <= 1 && body.details.email) return;

    if (body.details.first_name) {
      admin.first_name = body.details.first_name;
    }

    if (body.details.middle_name || body.details.middle_name === '') {
      admin.middle_name = body.details.middle_name;
    }

    if (body.details.last_name) {
      admin.last_name = body.details.last_name;
    }

    if (body.details.contact_number) {
      admin.contact_number = body.details.contact_number;
    }

    if (body.details.gender) {
      admin.gender = body.details.gender;
    }

    return await this.adminRepository.save(admin);
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  async removeAdmin(id: number): Promise<{ affected?: number }> {
    return this.adminRepository.delete(id);
  }
}
