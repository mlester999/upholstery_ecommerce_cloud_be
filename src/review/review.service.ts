import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from 'src/seller/entities/seller.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class ReviewService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  /**
   * this is function is used to create Review in Seller Balance Entity.
   * @param createReviewDto this will type of createReviewDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of review
   */
  async createReview(
    createReviewDto: CreateReviewDto,
    reviewId: string,
    orderId: string,
    shop: Shop,
    product: Product,
    customer: Customer
  ): Promise<Review> {
    const review: Review = new Review();

    review.review_id = reviewId;
    review.order_id = orderId;
    review.shop = shop;
    review.product = product;
    review.customer = customer;
    review.comments = createReviewDto.comments;
    review.ratings = createReviewDto.ratings;
    review.is_active = ActiveType.Active;

    return this.reviewRepository.save(review);
  }

  /**
   * this function is used to get all the review's list
   * @returns promise of array of reviews
   */
  async findAllReview(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: {
          shop: true,
          product: true,
          customer: true
      },
    });
  }

  async findById(id: number): Promise<Review | undefined> {
    return this.reviewRepository.findOne({
      where: { id },
      relations: {
          shop: true,
          product: true,
          customer: true
      },
    });
  }

  async findByShopId(id: number): Promise<Review | undefined> {
    return this.reviewRepository.findOne({
      where: {
        shop: {
          id,
        },
        is_active: 1,
      },
      relations: {
          shop: true,
          product: true,
          customer: true
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of review.
   * @returns promise of review
   */
  async viewReview(id: number): Promise<Review> {
    return this.reviewRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific review whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of review.
   * @param updateReviewDto this is partial type of createReviewDto.
   * @returns promise of update review
   */
  async updateReview(body: any, id: number, shop: Shop, product: Product, customer: Customer): Promise<Review> {
    const review = await this.findById(
      id,
    );

    if (!review) {
      throw new NotFoundException(`Review not found`);
    }

    if (shop) {
      review.shop = shop;
    }

    if (product) {
      review.product = product;
    }

    if (customer) {
      review.customer = customer;
    }

    if (body.details.comments) {
      review.comments = body.details.comments;
    }

    if (body.details.ratings) {
      review.ratings = body.details.ratings;
    }

    if (body.details.is_active) {
      review.is_active = body.details.is_active;
    }

    return await this.reviewRepository.save(review);
  }

  async deactivateReview(id: number): Promise<Review> {
    const review = await this.findById(id);

    if (!review) {
      throw new NotFoundException(`Review not found`);
    }

    review.is_active = ActiveType.NotActive;

    return await this.reviewRepository.save(review);
  }

  async activateReview(id: number): Promise<Review> {
    const review = await this.findById(id);

    if (!review) {
      throw new NotFoundException(`Review not found`);
    }

    review.is_active = ActiveType.Active;

    return await this.reviewRepository.save(review);
  }

  /**
   * this function is used to remove or delete review from database.
   * @param id is the type of number, which represent id of review
   * @returns number of rows deleted or affected
   */
  async removeReview(id: number): Promise<{ affected?: number }> {
    return this.reviewRepository.delete(id);
  }
}
