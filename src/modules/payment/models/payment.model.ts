import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UsersModel } from "src/modules/users/models/users.model";
import { IPaymentType, IStatus } from "../interface/payment.interface";
import { PetitionModel } from "src/modules/petition/model/petition.model";
import { PaymentOptionsModel } from "./payment-option.model";



@Table({
    tableName: "payments",
    modelName: "PaymentModel",
    underscored: true,
    freezeTableName: true
})
export class PaymentModel extends Model<PaymentModel>{
    
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @ForeignKey(() => UsersModel)
    @AllowNull(false)
    @Column(DataType.STRING(128))
    userId!: string;

    @ForeignKey(() => PetitionModel)
    @AllowNull(false)
    @Column(DataType.STRING(128))
    petitionId!: string;

    @AllowNull(false)
    @Column(DataType.ENUM(IPaymentType.CONSULTATION, IPaymentType.PETITION_PREPARATION, IPaymentType.REVIEW_PETITION))
    paymentOptionName: IPaymentType;

    @ForeignKey(() => PaymentOptionsModel)
    @AllowNull(false)
    @Column(DataType.STRING(128))
    paymentOptionsId!: string;


    @BelongsTo(() => UsersModel)
    user!: UsersModel;

    @BelongsTo(() => PetitionModel)
    petition!: PetitionModel;

    @AllowNull(false)
    @Column(DataType.STRING(128))
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING(128))
    checkoutSessionId?: string;

    @AllowNull(false)
    @Column(DataType.STRING(255))
    paymentUrl?: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    amount!: number;

    @Default(IStatus.PENDING)
    @Column(DataType.ENUM(IStatus.FAILED, IStatus.PENDING, IStatus.SUCCESSFUL))
    status!:IStatus;
}