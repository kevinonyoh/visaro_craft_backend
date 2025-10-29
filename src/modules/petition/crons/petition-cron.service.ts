import { Injectable, Logger } from "@nestjs/common";
import { PetitionStageRepository } from "../repositories/Petition-stage.repository";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Op } from "sequelize";

@Injectable()
export class PetitionCronService {
  private readonly logger = new Logger(PetitionCronService.name);

  constructor(
    private readonly petitionStageRepository: PetitionStageRepository
  ){}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handlePetitionTracking() {
    this.logger.debug('Running daily petition status checker...');

    const newDate = new Date();

    const sevenDaysAgo = new Date(newDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    await this.updateWeekOnePetition(sevenDaysAgo, newDate);

    await this.updateInProgressPetition(sevenDaysAgo, newDate);


  }

  private async updateWeekOnePetition(sevenDaysAgo: any, newDate: any){
    const weekOneStage = await this.petitionStageRepository.findAll({
        weekNumber: 1,
        status: "PENDING",
        createdAt: {
            [Op.lte]: sevenDaysAgo,
          }
    });

    for (const stage of weekOneStage) {
        await stage.update({
          status: 'IN_PROGRESS',
          startedAt: newDate,
      });

       this.logger.log(`Stage ${stage.id} updated to IN_PROGRESS`);
    }
  }


  private async updateInProgressPetition(sevenDaysAgo: any, newDate: any){

    const petitionStatus = await this.petitionStageRepository.findAll({status: "IN_PROGRESS", startedAt: { [Op.lte]: sevenDaysAgo }});

    this.logger.log(`Found ${petitionStatus.length} stages to complete.`);

    for (const stage of petitionStatus) {
        await stage.update({
          status: 'COMPLETE',
          completedAt: newDate,
        });
  
    this.logger.log(`Stage ${stage.id} marked as COMPLETE`);

    const nextStage = await this.petitionStageRepository.findOne({
          petitionId: stage.petitionId,
          weekNumber: stage.weekNumber + 1,
          status: 'PENDING',
      });

      if (nextStage) {
        await nextStage.update({
          status: 'IN_PROGRESS',
          startedAt: newDate,
        });

        this.logger.log(`Next week ${nextStage.weekNumber} stage started (IN_PROGRESS)`);
      } 
   }

 }
}