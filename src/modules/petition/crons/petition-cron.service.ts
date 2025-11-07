import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Op } from "sequelize";
import { PetitionStageRepository } from "../repositories/Petition-stage.repository";
import { PetitionRepository } from "../repositories/petition.repository";

@Injectable()
export class PetitionCronService {
  private readonly logger = new Logger(PetitionCronService.name);

  constructor(
    private readonly petitionStageRepository: PetitionStageRepository,
    private readonly petitionRepository: PetitionRepository
  ) {}

 
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
 
  @Cron('*/8 * * * *')
  async handlePetitionTracking() {
    this.logger.debug("Running daily petition stage tracker...");

    const now = new Date();
    const sevenDaysAgo = new Date();
    // sevenDaysAgo.setDate(now.getDate() - 7);

    sevenDaysAgo.setMinutes(now.getMinutes() - 10);
    
    const pendingStages = await this.petitionStageRepository.findAll({status: "PENDING", pendingSince: { [Op.lte]: sevenDaysAgo }});


    for (const stage of pendingStages) {
      await stage.update({
        status: "IN_PROGRESS",
        startedAt: now,
      });

      await this.petitionRepository.update({id: stage.petitionId }, { status: "in_progress" });

      this.logger.log(`Petition ${stage.petitionId} - Week ${stage.weekNumber} moved to IN_PROGRESS`);
    }

    this.logger.debug(`Total updated stages: ${pendingStages.length}`);
  
  }
}
