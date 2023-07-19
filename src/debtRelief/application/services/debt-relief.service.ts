import { PaymentScheduleService } from "../../../paymentSchedule/application/service/payment-schedule.service";
import { PaymentInstallment } from "../../../paymentSchedule/domain/models/payment-installment.model";
import { PaymentShedule } from "../../../paymentSchedule/domain/models/payment-schedule.model";
import { PaymentScheduleRepositoryHTTP } from "../../../paymentSchedule/infrastructure/repositories/payment-schedule.repository";

export class DebtReliefService {
    private paymentScheduleService: PaymentScheduleService;

    constructor() {
        this.paymentScheduleService = new PaymentScheduleService(new PaymentScheduleRepositoryHTTP());
    }

    installmentAmounts = async (creditCode: string, installmentNumber: number): Promise<PaymentInstallment | undefined> => {
        const scheduleCredit = await this.paymentScheduleService.findPaymentSchedule(creditCode);

        return scheduleCredit.paymentInstallment.find((installment) => installment.numberPayment === installmentNumber)
    }

    paymentSchedule = async (creditCode: string): Promise<PaymentShedule | undefined> => {
        const schedule = this.paymentScheduleService.findPaymentSchedule(creditCode)
        return schedule;
    }
}