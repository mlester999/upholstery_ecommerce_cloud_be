import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * this is function is used to create Category in Category Entity.
   * @param createCategoryDto this will type of createCategoryDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of category
   */
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category: Category = new Category();

    category.title = createCategoryDto.title;
    category.description = createCategoryDto.description;
    category.is_active = ActiveType.Active;

    return this.categoryRepository.save(category);
  }

  /**
   * this function is used to get all the category's list
   * @returns promise of array of categories
   */
  async findAllCategory(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findById(id: number): Promise<Category | undefined> {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of category.
   * @returns promise of category
   */
  async viewCategory(id: number): Promise<Category> {
    return this.categoryRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific category whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of category.
   * @param updateCategoryDto this is partial type of createCategoryDto.
   * @returns promise of update category
   */
  async updateCategory(body: any, id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({
      id,
    });

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    if (body.details.title) {
      category.title = body.details.title;
    }

    if (body.details.description) {
      category.description = body.details.description;
    }

    return await this.categoryRepository.save(category);
  }

  async deactivateCategory(id: number): Promise<Category> {
    const category = await this.findById(id);

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    category.is_active = 0;

    return await this.categoryRepository.save(category);
  }

  async activateCategory(id: number): Promise<Category> {
    const category = await this.findById(id);

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    category.is_active = 1;

    return await this.categoryRepository.save(category);
  }

  /**
   * this function is used to remove or delete category from database.
   * @param id is the type of number, which represent id of category
   * @returns number of rows deleted or affected
   */
  async removeCategory(id: number): Promise<{ affected?: number }> {
    return this.categoryRepository.delete(id);
  }
}
