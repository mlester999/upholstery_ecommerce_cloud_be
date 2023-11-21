import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';
import { ActivityLog } from './entities/activity-log.entity';


@Injectable()
export class ActivityLogService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(ActivityLog) private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  /**
   * this is function is used to create ActivityLog in ActivityLog Entity.
   * @param createActivityLogDto this will type of createActivityLogDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of activityLog
   */
  async createActivityLog(
    createActivityLogDto: CreateActivityLogDto,
  ): Promise<ActivityLog> {
    const activityLog: ActivityLog = new ActivityLog();

    activityLog.title = createActivityLogDto.title;
    activityLog.description = createActivityLogDto.description;
    activityLog.ip_address = createActivityLogDto.ip_address;

    return this.activityLogRepository.save(activityLog);
  }

  /**
   * this function is used to get all the activityLog's list
   * @returns promise of array of activityLogs
   */
  async findAllActivityLog(): Promise<ActivityLog[]> {
    return this.activityLogRepository.find();
  }

  async findById(id: number): Promise<ActivityLog | undefined> {
    return this.activityLogRepository.findOneBy({ id });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of activityLog.
   * @returns promise of activityLog
   */
  async viewActivityLog(id: number): Promise<ActivityLog> {
    return this.activityLogRepository.findOneBy({ id });
  }

  /**
   * this function is used to remove or delete activityLog from database.
   * @param id is the type of number, which represent id of activityLog
   * @returns nuber of rows deleted or affected
   */
  async removeActivityLog(id: number): Promise<{ affected?: number }> {
    return this.activityLogRepository.delete(id);
  }
}
