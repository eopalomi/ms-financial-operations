import { Request, Response } from "express";
import { CreateDebtReliefUsecase } from "../../application/create-debt-relief.use-case";
import { DebtRelief } from "../../domain/model/debt-relief.model";
import { FindDebtReliefUsecase } from "../../application/find-debt-relief.use-case";
import { DeleteDebtReliefUseCase } from "../../application/delete-debt-relief.use-case";
import { CreateDebtReliefDTO } from "../DTO/create-debt-relief-params.dto";
import { validate } from "class-validator";
import { debtReliefException } from "../../shared/exceptions/debt-relief.exceptions";

export class DebtReliefController {
    private errorResponse = {
        statusCode: 500,
        response: {
            code: '99',
            message: 'Internal Server Error'
        }
    };

    constructor(
        private createDebtReliefUsecase: CreateDebtReliefUsecase,
        private findDebtReliefUsecase: FindDebtReliefUsecase,
        private deleteDebtReliefUseCase: DeleteDebtReliefUseCase
    ) { }

    createDebtRelief = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const createDebtReliefDTO: CreateDebtReliefDTO = Object.assign(new CreateDebtReliefDTO(), body);
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

            return this.sendResponse(res, 200, {
                code: '00',
                message: 'Debt Relief created successfully',
                data: debtReliefProps
            });
        } catch (error) {
            this.handleErrors(error as Error);
            return this.sendResponse(res, this.errorResponse.statusCode, this.errorResponse.response);
        }
    };

    findDebtReliefs = async (req: Request, res: Response) => {
        const { creditCode } = req.params;

        if (!creditCode) {
            throw new debtReliefException('creditCodeEmpty', 'Credit code is empty');
        };

        try {
            const debtsRelief = await this.findDebtReliefUsecase.findAll(creditCode);

            return this.sendResponse(res, 200, {
                code: '00',
                message: 'Debt relief was successfully found',
                data: debtsRelief
            });
        } catch (error) {
            this.handleErrors(error as Error);
            return this.sendResponse(res, this.errorResponse.statusCode, this.errorResponse.response);
        }
    }

    deleteDebtRelief = async (req: Request, res: Response) => {
        const { creditCode } = req.params;
        const { id_pagcre } = req.query;

        try {
            if (!creditCode) {
                throw new debtReliefException('creditCodeEmpty', 'Credit code is empty');
            };

            if (!id_pagcre) {
                throw new debtReliefException('idPaymentIsEmpty', 'payment id is empty');
            };

            await this.deleteDebtReliefUseCase.execute(creditCode, parseInt(id_pagcre as string))

            return this.sendResponse(res, 204, {
                code: '00',
                message: 'Debt relief was successfully deleted'
            });
        } catch (error) {
            this.handleErrors(error as Error);
            return this.sendResponse(res, this.errorResponse.statusCode, this.errorResponse.response);
        }
    }

    private handleErrors(error: Error) {
        if (error instanceof debtReliefException) {
            this.errorResponse = {
                statusCode: 400,
                response: {
                    code: '01',
                    message: error.message
                }
            }
        };

        console.error(error);
    }

    private sendResponse(res: Response, statusCode: number, responseData: any) {
        res.status(statusCode).json(responseData);
    }
}