import { Injectable } from '@nestjs/common';
import { CreateAuditTrailDto, GetoAuditTrailDto } from './dto/create-audit-trail.dto';
import { UpdateAuditTrailDto } from './dto/update-audit-trail.dto';
import { ActivitiesRepository } from './repositories/audit-trail.repository';
import { Transaction } from 'sequelize';

@Injectable()
export class AuditTrailService {
  
  constructor(private readonly activitieRepository: ActivitiesRepository){}

  async create(data: any, transaction?: Transaction) {
     await this.activitieRepository.create({...data}, transaction);
  }

  async findActivities(data: GetoAuditTrailDto){
    return await this.activitieRepository.findAll({...data}, { order: [['createdAt', 'DESC']]});
  }

}
