import { ModelRepository } from "src/shared/database/repository/model.repository";
import { Injectable } from "@nestjs/common";
import { AgentsModel } from "../model/agent.model";



@Injectable()
export class AgentsRepository extends ModelRepository<AgentsModel> {
    constructor() {
        super(AgentsModel);
    }
}