import { Injectable } from '@nestjs/common';

@Injectable()
export class SemaphoreService {
  create() {
    return 'This action adds a new semaphore';
  }

  findAll() {
    return `This action returns all semaphore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} semaphore`;
  }

  update(id: number) {
    return `This action updates a #${id} semaphore`;
  }

  remove(id: number) {
    return `This action removes a #${id} semaphore`;
  }
}
