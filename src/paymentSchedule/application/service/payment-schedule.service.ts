import { PaymentScheduleRepository } from "../../domain/repositories/payment-schedule.repository";

export class PaymentScheduleService {
    constructor(private paymentScheduleRepository: PaymentScheduleRepository) { }

    findPaymentSchedule = async (creditCode: string) => {
        return this.paymentScheduleRepository.find(creditCode);
    }
}