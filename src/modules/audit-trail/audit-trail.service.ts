import { Injectable } from '@nestjs/common';
import { CreateAuditTrailDto } from './dto/create-audit-trail.dto';
import { UpdateAuditTrailDto } from './dto/update-audit-trail.dto';
import { ActivitiesRepository } from './repositories/audit-trail.repository';
import { Transaction } from 'sequelize';

@Injectable()
export class AuditTrailService {
  
  constructor(private readonly activitieRepository: ActivitiesRepository){}

  async create(description: string, transaction?: Transaction) {
     await this.activitieRepository.create({description}, transaction);
  }

  async findActivities(){
    return await this.activitieRepository.findAll({}, { order: [['createdAt', 'DESC']]});
  }

}
