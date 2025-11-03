import { ModelRepository } from "src/shared/database/repository/model.repository";
import { ChatMessagesModel } from "../model/chat.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatMessagesRepository extends ModelRepository<ChatMessagesModel> {
    constructor() {
        super(ChatMessagesModel);
    }
}