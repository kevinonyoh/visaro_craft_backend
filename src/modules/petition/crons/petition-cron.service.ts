import { Injectable, Logger } from "@nestjs/common";
import { PetitionStageRepository } from "../repositories/Petition-stage.repository";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Op } from "sequelize";
import { PetitionRepository } from "../repositories/petition.repository";

@Injectable()
export class PetitionCronService {
  private readonly logger = new Logger(PetitionCronService.name);

  constructor(
    private readonly petitionStageRepository: PetitionStageRepository,
    private readonly petitionRepository: PetitionRepository
  ){}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handlePetitionTracking() {
    this.logger.debug('Running daily petition status checker...');

    const newDate = new Date();

    const sevenDaysAgo = new Date(newDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    await this.updateWeekOnePetition(sevenDaysAgo, newDate);

  }

  private async updateWeekOnePetition(sevenDaysAgo: any, newDate: any){
    const weekOneStage = await this.petitionStageRepository.findAll({
        weekNumber: 1,
        status: "PENDING",
        createdAt: {
            [Op.lte]: sevenDaysAgo,
          }
    });

    await this.petitionRepository.update({id: weekOneStage["petitionId"]}, {status: "in_progress"});

    for (const stage of weekOneStage) {
        await stage.update({
          status: 'IN_PROGRESS',
          startedAt: newDate,
      });

       this.logger.log(`Stage ${stage.id} updated to IN_PROGRESS`);
    }
  }

}