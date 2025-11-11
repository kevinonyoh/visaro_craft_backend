export interface INotification{
    agentId?: string;
    userId?: string;
    recipientType:  "USER" | "AGENT";
    title: string;
    message: string;
}