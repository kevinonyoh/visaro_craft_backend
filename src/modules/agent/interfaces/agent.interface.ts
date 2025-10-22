export interface IAgentBank{
    bankName: string;
    AccountNumber: string;
    AccountName: string;
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