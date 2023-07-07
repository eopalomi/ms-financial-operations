import { PaymentShedule } from '../model/payment-schedule.model';

export interface PaymentScheduleRepository {
    save(DebtWaiver: PaymentShedule): Promise<void>;
    cancel(): Promise<void>;
    find(creditCode: string): Promise<PaymentShedule>;
    findAll(): Promise<PaymentShedule[]>;
};
