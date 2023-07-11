import { PaymentShedule } from '../domain/models/payment-schedule.model';
import { PaymentScheduleRepository } from '../domain/repositories/payment-schedule.repository';

export class FindPaymentScheduleUsecase {
    constructor(private paymentScheduleRepository: PaymentScheduleRepository) { }

    execute = async (creditCode: string): Promise<any> => {
        return await this.paymentScheduleRepository.find(creditCode);
    };

}