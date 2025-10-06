export enum IPaymentType{
  CONSULTATION = "consultation",
  FIRST_INSTALLMENT = "first_installment",
  SECOND_INSTALLMENT = "second_installment"
}

export enum IStatus{
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCESSFUL = 'successful'
}

export interface IPaymentIntent{
  amount: number;
  currency: string;
  description: string;
  metadata: {
    paymentType: string;
    userId: string;
  };
  receipt_email: string;
  payment_method_types?: string[]; 
  payment_method?: string; 
}