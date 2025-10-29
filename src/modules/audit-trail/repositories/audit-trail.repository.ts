import { ModelRepository } from "src/shared/database/repository/model.repository";
import { Injectable } from "@nestjs/common";
import { ActivitiesModel } from "../model/audit-trail.model";




@Injectable()
export class ActivitiesRepository extends ModelRepository<ActivitiesModel> {
    constructor() {
        super(ActivitiesModel);
    }
}