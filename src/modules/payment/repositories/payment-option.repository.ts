import { ModelRepository } from "src/shared/database/repository/model.repository";
import { Injectable } from "@nestjs/common";
import { PaymentOptionsModel } from "../models/payment-option.model";



@Injectable()
export class PaymentOptionsRepository extends ModelRepository<PaymentOptionsModel> {
    constructor() {
        super(PaymentOptionsModel);
    }
}