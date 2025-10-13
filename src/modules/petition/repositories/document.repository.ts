import { ModelRepository } from "src/shared/database/repository/model.repository";
import { Injectable } from "@nestjs/common";
import { DocumentsModel } from "../model/document.model";





@Injectable()
export class DocumentRepository extends ModelRepository<DocumentsModel> {
    constructor() {
        super(DocumentsModel);
    }
}