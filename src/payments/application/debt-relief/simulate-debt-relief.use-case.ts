import { DebtRelief } from '../../domain/model/debt-relief.model';
import { DebtReliefRepository } from '../../domain/repositories/debt-relief.repository';
import { SimulateDebtReliefParamsDTO } from '../../infrastructure/DTO/simulate-debt-relief-params.dto';

export class SimulateDebtReliefUsecase {

   constructor(private debtReliefRepository: DebtReliefRepository) {}

   execute = async (creditPayments: SimulateDebtReliefParamsDTO[]): Promise<DebtRelief[]> => {
      const payments: DebtRelief[] = [];

      const paymentPromises = creditPayments.map(async (payment) => {
         const paymentSchedule = await this.debtReliefRepository.findPaymentSchedule(payment.creditCode);
            
         if (!paymentSchedule) return;

         paymentSchedule.installments
            .filter(installment => (
               installment.principalBalance + 
                    installment.interestBalance + 
                    installment.feesbalance + 
                    installment.vehicleInsuranceBalance +
                    installment.lifeInsuranceBalance +
                    installment.igvInsuranceBalance +
                    installment.preventionInsuranceBalance
            ) > 0.00
            )
            .reduce((amountBalance, installment) => {
               const debtReliefPayments = {
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

               if (amountBalance > 0) {
                  updateAmountBalance(installment.principalBalance, 'principalAmount');
                  updateAmountBalance(installment.interestBalance, 'interestAmount');
                  updateAmountBalance(installment.feesbalance, 'lateFeeAmount');
                  updateAmountBalance(installment.vehicleInsuranceBalance, 'vehicleInsurance');
                  updateAmountBalance(installment.lifeInsuranceBalance, 'lifeInsurance');
                  updateAmountBalance(installment.igvInsuranceBalance, 'igvInsurance');
                  updateAmountBalance(installment.preventionInsuranceBalance, 'preventionInsurance');

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
                  }));
               }

               return amountBalance;
            }, +payment.amount.toFixed(2));
      });

      await Promise.all(paymentPromises);

      return payments;
   };
}