import { ModelRepository } from "src/shared/database/repository/model.repository";
import { Injectable } from "@nestjs/common";
import { AgentTransactionModel } from "../model/agent-transaction.model";





@Injectable()
export class AgentTransactionRepository extends ModelRepository<AgentTransactionModel> {
    constructor() {
        super(AgentTransactionModel);
    }
}