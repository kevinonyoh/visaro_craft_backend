import { ModelRepository } from "src/shared/database/repository/model.repository";
import { Injectable } from "@nestjs/common";
import { PetitionStageModel } from "../model/petition-stage.model";


@Injectable()
export class PetitionStageRepository extends ModelRepository<PetitionStageModel> {
    constructor() {
        super(PetitionStageModel);
    }
}