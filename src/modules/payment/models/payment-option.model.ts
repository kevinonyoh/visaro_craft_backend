import { AllowNull, AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { IPaymentType } from "../interface/payment.interface";

@Table({
    tableName: "payment_options",
    modelName: "PaymentOptionsModel",
    underscored: true,
    freezeTableName: true
})
export class PaymentOptionsModel extends Model<PaymentOptionsModel>{
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.ENUM(IPaymentType.CONSULTATION, IPaymentType.PETITION_PREPARATION, IPaymentType.REVIEW_PETITION))
    name: IPaymentType;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    amount: number;

    @AllowNull(true)
    @Column({
        type: DataType.STRING,
        defaultValue: 'usd',
    })
    currency: string;
}