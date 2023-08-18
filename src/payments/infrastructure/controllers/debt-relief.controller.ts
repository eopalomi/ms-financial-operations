import { Request, Response } from "express";
import { CreateDebtReliefUsecase } from "../../application/debt-relief/create-debt-relief.use-case";
import { DebtRelief } from "../../domain/model/debt-relief.model";
import { FindDebtReliefUsecase } from "../../application/debt-relief/find-debt-relief.use-case";
import { DeleteDebtReliefUseCase } from "../../application/debt-relief/delete-debt-relief.use-case";
import { CreateDebtReliefDTO } from "../DTO/create-debt-relief-params.dto";
import { ValidationError, validate } from "class-validator";
import { debtReliefException } from "../../shared/exceptions/debt-relief.exceptions";
import { SimulateDebtReliefUsecase } from "../../application/debt-relief/simulate-debt-relief.use-case";
import { SimulateDebtReliefParamsDTO } from "../DTO/simulate-debt-relief-params.dto";

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
        private deleteDebtReliefUseCase: DeleteDebtReliefUseCase,
        private simulateDebtReliefUsecase: SimulateDebtReliefUsecase,
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

            return this.sendResponse(res, 200, {
                code: '00',
                message: 'Debt relief was successfully deleted'
            });
        } catch (error) {
            this.handleErrors(error as Error);
            return this.sendResponse(res, this.errorResponse.statusCode, this.errorResponse.response);
        }
    }

    simulateDebtReliefs = async (req: Request, res: Response) => {
        try {
            const requestBody = req.body;

            if (!Array.isArray(requestBody)) {
                throw new debtReliefException('invalidArrayBodyRequest', 'invalid format body request, must be an array');
            }

            const payments: SimulateDebtReliefParamsDTO[] = requestBody.map((payment) => Object.assign(new SimulateDebtReliefParamsDTO(), payment))
            const validateErrors: ValidationError[][] = await Promise.all(payments.map((payment) => validate(payment)));

            if (validateErrors.some((errors) => errors.length > 0)) {
                return res.status(400).json({ message: 'Invalid body format', errors: validateErrors[0] });
            }

            const debtReliefs = await this.simulateDebtReliefUsecase.execute(payments)

            return this.sendResponse(res, 200, {
                code: '00',
                message: 'Debt Relief simulate successfully',
                data: debtReliefs
            });
        } catch (error) {
            this.handleErrors(error as Error);
            return this.sendResponse(res, this.errorResponse.statusCode, this.errorResponse.response);
        }
    };

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