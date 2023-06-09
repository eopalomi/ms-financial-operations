import { Request, Response } from "express";
import { CreateDebtReliefUsecase } from "../../application/create-debt-relief.use-case";
import { DebtRelief } from "../../domain/model/debt-relief.model";
import { FindDebtReliefUsecase } from "../../application/find-debt-relief.use-case";

export class DebtReliefController {
    constructor(private createDebtReliefUsecase: CreateDebtReliefUsecase, private findDebtReliefUsecase: FindDebtReliefUsecase) { }

    createDebtRelief = async (req: Request, res: Response) => {
        try {
            const body = req.body;

            let debtReliefProps = new DebtRelief({
                creditCode: body.creditCode,
                ammount: body.ammount,
                numberPayment: body.numberPayment,
                principalAmount: body.principalAmount,
                interestAmount: body.interestAmount,
                lateFeeAmount: body.lateFeeAmount,
                vehicleInsurance: body.vehicleInsurance,
                lifeInsurance: body.lifeInsurance,
                igvInsurance: body.igvInsurance,
                preventionInsurance: body.preventionInsurance,
                collectionLocationCode: body.collectionLocationCode,
                paymentType: body.paymentType,
                banckAccountCode: body.banckAccountCode,
                paymentDate: body.paymentDate,
                paymentHour: body.paymentHour,
                paymentValueDate: body.paymentValueDate,
                authorizationPersonCode: body.authorizationPersonCode,
                requestingPersonCode: body.requestingPersonCode,
                authorizationPersondocumentCode: body.authorizationPersondocumentCode,
                registeringPersonCode: body.registeringPersonCode,
                idDocumentWF: body.idDocumentWF
            });

            await this.createDebtReliefUsecase.execute(debtReliefProps);

            res.status(200).json({
                code: '00',
                message: 'Debt Relief created successfully'
            });
        } catch (error: any) {
            throw new Error(error)
        }
    };

    findDebtRelief = async (req: Request, res: Response) =>{
        try {
            const { creditCode } = req.params;

            const debtsRelief =  await this.findDebtReliefUsecase.findAll(creditCode);

            res.status(200).json({
                code: '00',
                message: 'Debt relief was successfully found',
                data: debtsRelief
            });
        } catch (error: any) {
            throw new Error(error)
        }
    }
}