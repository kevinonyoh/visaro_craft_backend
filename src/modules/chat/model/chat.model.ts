import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UsersModel } from "src/modules/users/models/users.model";
import { SenderType } from "../interface/chat.interface";
import { AdminModel } from "src/modules/admin/model/admin.model";


@Table({
    tableName: "chat_messages",
    modelName: "ChatMessagesModel",
    underscored: true,
    freezeTableName: true
})
export class ChatMessagesModel extends Model<ChatMessagesModel>{

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @ForeignKey(() => UsersModel)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    message: string;

    @AllowNull(false)
    @Column({
      type: DataType.ENUM(...Object.values(SenderType)),
    })
    senderType: SenderType;
       

    @BelongsTo(()=> UsersModel)
    user: UsersModel;
}