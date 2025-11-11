import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
  } from "sequelize-typescript";
import { AgentsModel } from "src/modules/agent/model/agent.model";
import { User } from "src/modules/users/entities/user.entity";
import { UsersModel } from "src/modules/users/models/users.model";

  
  @Table({
    tableName: "notifications",
    modelName: "NotificationModel",
    underscored: true,
    freezeTableName: true,
  })
  export class NotificationModel extends Model<NotificationModel> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @ForeignKey(() => AgentsModel)
    @AllowNull(true)
    @Column(DataType.UUID)
    agentId?: string;
  
    @ForeignKey(() => UsersModel)
    @AllowNull(true)
    @Column(DataType.UUID)
    userId?: string;
  
    @AllowNull(false)
    @Column(DataType.ENUM("USER", "AGENT"))
    recipientType!: "USER" | "AGENT";
  
    @AllowNull(false)
    @Column(DataType.STRING(255))
    title!: string;
  
    @AllowNull(false)
    @Column(DataType.TEXT)
    message!: string;

    @BelongsTo(() => UsersModel)
    user: UsersModel;

    @BelongsTo(() => AgentsModel)
    agent: AgentsModel;
}
  