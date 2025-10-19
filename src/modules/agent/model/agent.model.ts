import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { IAgentBank } from "../interfaces/agent.interface";


@Table({
    tableName: "agents",
    modelName: "AgentsModel",
    underscored: true,
    freezeTableName: true
})
export class AgentsModel extends Model<AgentsModel> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @AllowNull(false)
    @Column
    firstName: string;
  
    @AllowNull(false)
    @Column
    lastName: string;
  
    @Unique
    @AllowNull(false)
    @Column
    email: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    username: string;
  
    @AllowNull(true)
    @Column
    password?: string;
  
    @Default(false)
    @Column(DataType.BOOLEAN)
    isActivated!: boolean;
  
    @Default(false)
    @Column(DataType.BOOLEAN)
    isEmailVerified!: boolean;
  
    @AllowNull(false)
    @Column(DataType.JSON)
    bank: IAgentBank;
  
    @AllowNull(false)
    @Column
    pin!: string;
  
    toJSON() {
      const data = Object.assign({}, this.get());
      const { password, pin, ...rest } = data;
      return rest;
    }
  }