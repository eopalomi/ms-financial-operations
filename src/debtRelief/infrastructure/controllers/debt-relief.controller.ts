import { Request, Response } from "express";
import { CreateDebtReliefUsecase } from "../../application/create-debt-relief.use-case";
import { DebtRelief } from "../../domain/model/debt-relief.model";

export class DebtReliefController {
    constructor(private createDebtReliefUsecase: CreateDebtReliefUsecase) { }

    createDebtRelief = (req: Request, res: Response) => {
        try {
            const body = req.body;

            let debtReliefProps = new DebtRelief({
                creditCode: body.creditCode,
                ammount: body.ammount,
                numberPayment: body.numberPayment,
                principalAmount: body.principalAmount,
                interestAmount: body.interestAmount,
                lateFeeAmount: body.lateFeeAmount,
                collectionLocationCode: body.collectionLocationCode,
                banckAccountCode: body.banckAccountCode,
                paymentDate: body.paymentDate,
                paymentHour: body.paymentHour,
                paymentValueDate: body.paymentValueDate,
                authorizationPersonCode: body.authorizationPersonCode,
                authorizationPersondocumentCode: body.authorizationPersondocumentCode
            })

            const debtRelief = this.createDebtReliefUsecase.execute(debtReliefProps);

            res.status(200).json({
                code: '00',
                message: 'Debt Relief created successfully',
                data: debtRelief
            })
        } catch (error: any) {
            throw new Error(error)
        }
    };

}