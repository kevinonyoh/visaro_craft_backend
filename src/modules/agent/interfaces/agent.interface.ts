export interface IAgentBank{
    bankName: string;
    accountEmail: string;
}

export interface IAgent {
    id: string;
    email: string;
}


export enum IAgentRewardStatus{
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}

export enum IAgentTransactionStatus{
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
  