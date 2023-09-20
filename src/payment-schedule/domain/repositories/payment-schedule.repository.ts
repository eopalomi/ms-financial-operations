import { PaymentShedule } from '../models/payment-schedule.model';

export type PaymentScheduleRepository = {
   save(DebtWaiver: PaymentShedule): Promise<void>;
   cancel(): Promise<void>;
   find(creditCode: string): Promise<PaymentShedule>;
   findAll(): Promise<PaymentShedule[]>;
};
