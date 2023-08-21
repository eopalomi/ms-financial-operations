import { DebtRelief } from '../../domain/model/debt-relief.model';
import { DebtReliefRepository } from '../../domain/repositories/debt-relief.repository';
import { debtReliefException } from '../../shared/exceptions/debt-relief.exceptions';

export class CreateDebtReliefUsecase {
  constructor(private debtReliefRepository: DebtReliefRepository) {}

  execute = async (debtRelief: DebtRelief): Promise<void> => {
    const schedule = await this.debtReliefRepository.findPaymentSchedule(debtRelief.creditCode);
    const amounts = schedule.installments.find((installment)=> installment.numberPayment ===  debtRelief.numberPayment);

    if (!amounts) {
      throw new Error("installment number not found");
    }

    if (
      debtRelief.principalAmount > amounts.principalBalance ||
      debtRelief.interestAmount > amounts.interestBalance ||
      debtRelief.lateFeeAmount > amounts.feesbalance ||
      debtRelief.vehicleInsurance > amounts.vehicleInsuranceBalance ||
      debtRelief.lifeInsurance > amounts.lifeInsuranceBalance ||
      debtRelief.igvInsurance > amounts.igvInsuranceBalance ||
      debtRelief.preventionInsurance > amounts.preventionInsuranceBalance
    ) {
      throw new debtReliefException('amountGreaterBalance', 'amount is greater than installment balance');
    }

    await this.debtReliefRepository.save(debtRelief);
  };

}