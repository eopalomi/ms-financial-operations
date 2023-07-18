import { PaymentScheduleService } from "../../../paymentSchedule/application/service/payment-schedule.service";
import { PaymentInstallment } from "../../../paymentSchedule/domain/models/payment-installment.model";
import { PaymentScheduleRepositoryHTTP } from "../../../paymentSchedule/infrastructure/repositories/payment-schedule.repository";

export class DebtReliefService {
    constructor() { }

    installmentAmounts = async (creditCode: string, installmentNumber: number): Promise<PaymentInstallment | undefined> => {

        const paymentScheduleRepositoryHTTP = new PaymentScheduleRepositoryHTTP();
        const paymentScheduleService = new PaymentScheduleService(paymentScheduleRepositoryHTTP);
        const scheduleCredit = await paymentScheduleService.findPaymentSchedule(creditCode);

        return scheduleCredit.paymentInstallment.find((installment) => installment.numberPayment === installmentNumber)
    }
}