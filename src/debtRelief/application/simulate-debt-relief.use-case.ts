import { DebtRelief } from "../domain/model/debt-relief.model";
import { SimulateDebtReliefParamsDTO } from "../infrastructure/DTO/simulate-debt-relief-params.dto";
import { DebtReliefService } from './services/debt-relief.service';

export class SimulateDebtReliefUsecase {
    debtReliefService: DebtReliefService;

    constructor() {
        this.debtReliefService = new DebtReliefService();
    }

    execute = async (creditPayments: SimulateDebtReliefParamsDTO[]): Promise<DebtRelief[]> => {
        let payments: DebtRelief[] = []

        const paymentPromises = creditPayments.map(async (payment) => {
            let paymentSchedule = await this.debtReliefService.paymentSchedule(payment.creditCode);

            if (!paymentSchedule) return;

            paymentSchedule.paymentInstallment.reduce((amountBalance, installment) => {
                if (amountBalance > 0) {
                    let debtReliefPayments = {
                        principalAmount: 0.00,
                        interestAmount: 0.00,
                        lateFeeAmount: 0.00,
                        vehicleInsurance: 0.00,
                        lifeInsurance: 0.00,
                        igvInsurance: 0.00,
                        preventionInsurance: 0.00
                    };

                    const updateAmountBalance = (installmentBalance: number, paymentType: keyof typeof debtReliefPayments) => {
                        if (amountBalance > installmentBalance) {
                            amountBalance -= +installmentBalance.toFixed(2);
                            debtReliefPayments[paymentType] = +installmentBalance.toFixed(2);
                            installmentBalance = 0.00;
                        } else {
                            debtReliefPayments[paymentType] = +amountBalance.toFixed(2);
                            installmentBalance -= +amountBalance.toFixed(2);
                            amountBalance = 0.00;
                        }
                    };

                    updateAmountBalance(installment.principalBalance, 'principalAmount')
                    updateAmountBalance(installment.interestBalance, 'interestAmount')
                    updateAmountBalance(installment.feesbalance, 'lateFeeAmount')
                    updateAmountBalance(installment.vehicleInsuranceBalance, 'vehicleInsurance')
                    updateAmountBalance(installment.lifeInsuranceBalance, 'lifeInsurance')
                    updateAmountBalance(installment.igvInsuranceBalance, 'igvInsurance')
                    updateAmountBalance(installment.preventionInsuranceBalance, 'preventionInsurance')

                    payments.push(new DebtRelief({
                        creditCode: payment.creditCode,
                        amount: payment.amount,
                        numberPayment: installment.numberPayment,
                        ...debtReliefPayments,
                        collectionLocationCode: payment.collectionLocationCode,
                        paymentType: payment.paymentType,
                        banckAccountCode: null,
                        paymentDate: payment.paymentDate,
                        paymentHour: payment.paymentHour,
                        paymentValueDate: payment.paymentValueDate,
                        authorizationPersonCode: payment.authorizationPersonCode,
                        requestingPersonCode: payment.requestingPersonCode,
                        registeringPersonCode: payment.registeringPersonCode,
                        idDocumentWF: payment.idDocumentWF,
                        idPayment: null,
                    }))
                };

                return amountBalance;
            }, +payment.amount.toFixed(2));
        });

        await Promise.all(paymentPromises);

        return payments;
    }
}