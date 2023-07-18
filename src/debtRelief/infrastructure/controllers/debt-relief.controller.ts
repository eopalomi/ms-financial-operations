import { Request, Response } from "express";
import { CreateDebtReliefUsecase } from "../../application/create-debt-relief.use-case";
import { DebtRelief } from "../../domain/model/debt-relief.model";
import { FindDebtReliefUsecase } from "../../application/find-debt-relief.use-case";
import { DeleteDebtReliefUseCase } from "../../application/delete-debt-relief.use-case";
import { CreateDebtReliefDTO } from "../DTO/create-debt-relief-params.dto";
import { validate } from "class-validator";
import { debtReliefException } from "../../shared/exceptions/debt-relief.exceptions";

export class DebtReliefController {
    constructor(private createDebtReliefUsecase: CreateDebtReliefUsecase, private findDebtReliefUsecase: FindDebtReliefUsecase, private deleteDebtReliefUseCase: DeleteDebtReliefUseCase) { }

    createDebtRelief = async (req: Request, res: Response) => {
        try {
            const body = req.body;

            const createDebtReliefDTO = Object.assign(new CreateDebtReliefDTO(), body);

            const errors = await validate(createDebtReliefDTO);

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            };

            let debtReliefProps = new DebtRelief({
                ...createDebtReliefDTO,
                banckAccountCode: null,
                idPayment: null
            });

            await this.createDebtReliefUsecase.execute(debtReliefProps);

            return res.status(200).json({
                code: '00',
                message: 'Debt Relief created successfully',
                data: debtReliefProps
            });
        } catch (error) {
            console.error(error);

            let errorResponse = {
                statusCode: 500,
                response: {
                    code: '99',
                    message: 'Internal Server Error'
                }
            };

            if (error instanceof debtReliefException) {
                errorResponse = {
                    statusCode: 400,
                    response: {
                        code: '01',
                        message: error.message
                    }
                }
            };

            return res.status(errorResponse.statusCode).json(errorResponse.response);
        }
    };

    findDebtRelief = async (req: Request, res: Response) => {
        const { creditCode } = req.params;

        try {
            const debtsRelief = await this.findDebtReliefUsecase.findAll(creditCode);

            return res.status(200).json({
                code: '00',
                message: 'Debt relief was successfully found',
                data: debtsRelief
            });
        } catch (error) {
            console.error(error);

            let errorResponse = {
                statusCode: 500,
                response: {
                    code: '99',
                    message: 'Internal Server Error'
                }
            };

            if (error instanceof debtReliefException) {
                errorResponse = {
                    statusCode: 400,
                    response: {
                        code: '01',
                        message: error.message
                    }
                }
            };

            return res.status(errorResponse.statusCode).json(errorResponse.response);
        }
    }

    deleteDebtRelief = async (req: Request, res: Response) => {
        const { creditCode } = req.params;
        const { id_pagcre } = req.query;

        try {
            const resp = await this.deleteDebtReliefUseCase.execute(creditCode, parseInt(id_pagcre as string))

            return res.status(204).json({
                code: '00',
                message: 'Debt relief was successfully deleted'
            });
        } catch (error) {
            console.error(error);

            let errorResponse = {
                statusCode: 500,
                response: {
                    code: '99',
                    message: 'Internal Server Error'
                }
            };

            if (error instanceof debtReliefException) {
                errorResponse = {
                    statusCode: 400,
                    response: {
                        code: '01',
                        message: error.message
                    }
                }
            };

            return res.status(errorResponse.statusCode).json(errorResponse.response);
        }
    }
}