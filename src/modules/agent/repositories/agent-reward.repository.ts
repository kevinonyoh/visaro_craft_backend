import { ModelRepository } from "src/shared/database/repository/model.repository";
import { Injectable } from "@nestjs/common";
import { AgentRewardsModel } from "../model/agent-reward.model";



@Injectable()
export class AgentRewardRepository extends ModelRepository<AgentRewardsModel> {
    constructor() {
        super(AgentRewardsModel);
    }
}