import { Request, Response } from "express";
import { CreateDebtReliefUsecase } from "../../application/create-debt-relief.use-case";
import { DebtRelief } from "../../domain/model/debt-relief.model";
import { FindDebtReliefUsecase } from "../../application/find-debt-relief.use-case";
import { DeleteDebtReliefUseCase } from "../../application/delete-debt-relief.use-case";
import { CreateDebtReliefDTO } from "../DTO/create-debt-relief-params.dto";
import { validate } from "class-validator";

export class DebtReliefController {
    constructor(private createDebtReliefUsecase: CreateDebtReliefUsecase, private findDebtReliefUsecase: FindDebtReliefUsecase, private deleteDebtReliefUseCase: DeleteDebtReliefUseCase) { }

    createDebtRelief = async (req: Request, res: Response) => {
        try {
            const body = req.body;

            const createDebtReliefDTO = new CreateDebtReliefDTO();
            Object.assign(createDebtReliefDTO, body);

            const errors = await validate(createDebtReliefDTO);

            if (errors.length > 0) {
                res.status(400).json({ errors });
                return;
            };
            
            let debtReliefProps = new DebtRelief({
                creditCode: body.creditCode,
                amount: body.amount,
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
                registeringPersonCode: body.registeringPersonCode,
                idDocumentWF: body.idDocumentWF,
                idPayment: null
            });

            await this.createDebtReliefUsecase.execute(debtReliefProps);
            
            res.status(200).json({
                code: '00',
                message: 'Debt Relief created successfully',
                data: debtReliefProps
            });
        } catch (error: any) {
            res.status(200).json({
                code: '99',
                message: 'error',
                data: error.message
            });
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

    deleteDebtRelief = async (req: Request, res: Response) => {
        const {creditCode} = req.params;
        const {id_pagcre} = req.query;
        
        try {
            const resp = await this.deleteDebtReliefUseCase.execute(creditCode, parseInt(id_pagcre as string))
            
            res.status(204).json({
                code: '00',
                message: 'Debt relief was successfully deleted'
            });
        } catch (error: any) {
            throw new Error(error)
        }
    }
}