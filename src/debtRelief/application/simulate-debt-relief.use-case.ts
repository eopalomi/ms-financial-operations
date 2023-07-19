import { DebtRelief } from "../domain/model/debt-relief.model";
import { DebtReliefRepository } from "../domain/repositories/debt-relief.repository";
import { SimulateDebtReliefParamsDTO } from "../infrastructure/DTO/simulate-debt-relief-params.dto";
import { DebtReliefService } from './services/debt-relief.service';

export class SimulateDebtReliefUsecase {
    debtReliefService: DebtReliefService;
    constructor(private debtReliefRepository: DebtReliefRepository) {
        this.debtReliefService = new DebtReliefService();
    }

    execute = async (creditPayments: SimulateDebtReliefParamsDTO[]): Promise<DebtRelief[]> => {
        let payments: DebtRelief[] = []

        const paymentPromises = creditPayments.map(async (payment) => {
            let paymentSchedule = await this.debtReliefService.paymentSchedule(payment.creditCode);

            paymentSchedule?.paymentInstallment.reduce((amountBalance, installment) => {

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

                    if (amountBalance > installment.principalBalance) {
                        amountBalance -= +installment.principalBalance.toFixed(2);
                        debtReliefPayments.principalAmount = +installment.principalBalance.toFixed(2);
                        installment.principalBalance = 0.00;
                    } else {
                        installment.principalBalance -= +amountBalance.toFixed(2);
                        debtReliefPayments.principalAmount = +amountBalance.toFixed(2);
                        amountBalance = 0.00;
                    }

                    if (amountBalance > installment.interestBalance) {
                        amountBalance -= +installment.interestBalance.toFixed(2);
                        debtReliefPayments.interestAmount = +installment.interestBalance.toFixed(2);
                        installment.interestBalance = 0.00;
                    } else {
                        installment.interestBalance -= +amountBalance.toFixed(2);
                        debtReliefPayments.interestAmount = +amountBalance.toFixed(2);
                        amountBalance = 0.00;
                    }

                    if (amountBalance > installment.feesbalance) {
                        amountBalance -= +installment.feesbalance.toFixed(2);
                        debtReliefPayments.lateFeeAmount = +installment.feesbalance.toFixed(2);
                        installment.feesbalance = 0.00;
                    } else {
                        installment.feesbalance -= +amountBalance.toFixed(2);
                        debtReliefPayments.lateFeeAmount = +amountBalance.toFixed(2);
                        amountBalance = 0.00;
                    }

                    if (amountBalance > installment.vehicleInsuranceBalance) {
                        amountBalance -= +installment.vehicleInsuranceBalance.toFixed(2);
                        debtReliefPayments.vehicleInsurance = +installment.vehicleInsuranceBalance.toFixed(2);
                        installment.vehicleInsuranceBalance = 0.00;
                    } else {
                        installment.vehicleInsuranceBalance -= +amountBalance.toFixed(2);
                        debtReliefPayments.vehicleInsurance = +amountBalance.toFixed(2);
                        amountBalance = 0.00;
                    }

                    if (amountBalance > installment.lifeInsuranceBalance) {
                        amountBalance -= +installment.lifeInsuranceBalance.toFixed(2);
                        debtReliefPayments.lifeInsurance = +installment.lifeInsuranceBalance.toFixed(2);
                        installment.lifeInsuranceBalance = 0.00;
                    } else {
                        installment.lifeInsuranceBalance -= +amountBalance.toFixed(2);
                        debtReliefPayments.lifeInsurance = +amountBalance.toFixed(2);
                        amountBalance = 0.00;
                    }

                    if (amountBalance > installment.preventionInsuranceBalance) {
                        amountBalance -= +installment.preventionInsuranceBalance.toFixed(2);
                        debtReliefPayments.preventionInsurance = +installment.preventionInsuranceBalance.toFixed(2);
                        installment.preventionInsuranceBalance = 0.00;
                    } else {
                        installment.preventionInsuranceBalance -= +amountBalance.toFixed(2);
                        debtReliefPayments.preventionInsurance = +amountBalance.toFixed(2);
                        amountBalance = 0.00;
                    }


                    payments.push(new DebtRelief({
                        creditCode: payment.creditCode,
                        amount: payment.amount,
                        numberPayment: installment.numberPayment,
                        principalAmount: debtReliefPayments.principalAmount,
                        interestAmount: debtReliefPayments.interestAmount,
                        lateFeeAmount: debtReliefPayments.lateFeeAmount,
                        vehicleInsurance: debtReliefPayments.vehicleInsurance,
                        lifeInsurance: debtReliefPayments.lifeInsurance,
                        igvInsurance: debtReliefPayments.igvInsurance,
                        preventionInsurance: debtReliefPayments.preventionInsurance,
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