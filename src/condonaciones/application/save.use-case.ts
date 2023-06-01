import { DebtWaiverRepository } from "../domain/repositories/debt-waiver.repository";

export class SaveUsecase {
    constructor(private debtWaiverRepository: DebtWaiverRepository) { }

    execute = async (): Promise<void> => {
        await this.debtWaiverRepository.save();
    };
}