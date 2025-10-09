import { ModelRepository } from "src/shared/database/repository/model.repository";
import { Injectable } from "@nestjs/common";
import { PetitionModel } from "../model/petition.model";




@Injectable()
export class PetitionRepository extends ModelRepository<PetitionModel> {
    constructor() {
        super(PetitionModel);
    }
}