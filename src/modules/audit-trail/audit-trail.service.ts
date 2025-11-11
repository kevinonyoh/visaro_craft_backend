import { Injectable } from '@nestjs/common';
import { CreateAuditTrailDto, GetoAuditTrailDto } from './dto/create-audit-trail.dto';
import { UpdateAuditTrailDto } from './dto/update-audit-trail.dto';
import { ActivitiesRepository } from './repositories/audit-trail.repository';
import { Transaction } from 'sequelize';
import { NotificationRepository } from './repositories/notification.repository';

@Injectable()
export class AuditTrailService {
  
  constructor(
    private readonly activitieRepository: ActivitiesRepository,
    private readonly notificationRepository: NotificationRepository
    ){}

  async create(data: any, transaction?: Transaction) {
     await this.activitieRepository.create({...data}, transaction);
  }

  async findActivities(data: GetoAuditTrailDto){
    return await this.activitieRepository.findAll({...data}, { order: [['createdAt', 'DESC']]});
  }


  async createNotification(data: any, transaction?: Transaction){
    await this.notificationRepository.create({...data}, transaction);
  }

  async findUserNotification(userId: string){
    return await this.notificationRepository.findAll({userId});
  }


  async findAgentNotification(agentId: string){
    return await this.notificationRepository.findAll({agentId});
  }
}
