import { DebtReliefRepository } from "../domain/repositories/debt-relief.repository";

export class DeleteDebtReliefUseCase {
    constructor(private debtReliefRepository: DebtReliefRepository){}

    execute = async (creditCode: string, idPayment: number)=>{
        await this.debtReliefRepository.delete(creditCode, idPayment);
    }
}