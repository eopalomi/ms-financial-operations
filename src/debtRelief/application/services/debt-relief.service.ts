import { PaymentScheduleService } from "../../../paymentSchedule/application/service/payment-schedule.service";
import { PaymentScheduleRepositoryHTTP } from "../../../paymentSchedule/infrastructure/repositories/payment-schedule.repository";

export class DebtReliefService {
    constructor() { }

    validateInstallment = async (creditCode: string, installmentNumber: number) => {
        const paymentScheduleRepositoryHTTP = new PaymentScheduleRepositoryHTTP();
        const paymentScheduleService = new PaymentScheduleService(paymentScheduleRepositoryHTTP);
        const schedule = await paymentScheduleService.findPaymentSchedule(creditCode);



        console.log("schedule 111", schedule)

    }
}