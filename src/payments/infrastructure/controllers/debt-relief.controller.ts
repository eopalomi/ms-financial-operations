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
import { DeleteDebtReliefDTO } from "../DTO/delete-debt-relief-params.dto";

export class DebtReliefController {
    constructor(
        private createDebtReliefUsecase: CreateDebtReliefUsecase,
        private findDebtReliefUsecase: FindDebtReliefUsecase,
        private deleteDebtReliefUseCase: DeleteDebtReliefUseCase,
        private simulateDebtReliefUsecase: SimulateDebtReliefUsecase,
    ) { }

    createDebtRelief = async (req: Request, res: Response) => {
        try {
            const createDebtReliefDTO: CreateDebtReliefDTO = Object.assign(new CreateDebtReliefDTO(), req.body);

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
            }, null);
        } catch (error) {
            return this.sendResponse(res, null, null, error as Error);
        }
    };

    findDebtReliefs = async (req: Request, res: Response) => {
        try {
            const { creditCode } = req.params;

            if (!creditCode) {
                throw new debtReliefException('creditCodeEmpty', 'Credit code is empty');
            };

            const debtsRelief = await this.findDebtReliefUsecase.findAll(creditCode);

            return this.sendResponse(res, 200, {
                code: '00',
                message: 'Debt relief was successfully found',
                data: debtsRelief
            }, null);
        } catch (error) {
            return this.sendResponse(res, null, null, error as Error);
        }
    }

    deleteDebtRelief = async (req: Request, res: Response) => {
        try {
            const { creditCode } = req.params;
            const { idPayment } = req.query;
            
            // const deleteDebtReliefDTO: DeleteDebtReliefDTO = Object.assign(new DeleteDebtReliefDTO(), req.body);

            // const errors = await validate(deleteDebtReliefDTO);

            // if (errors.length > 0){
            //     return res.status(400).json({ errors });
            // }

            // if (!creditCode) {
            if (!idPayment) {
                throw new debtReliefException('creditCodeEmpty', 'Credit code is empty');
            };

            // await this.deleteDebtReliefUseCase.execute(creditCode, deleteDebtReliefDTO.idPayment, deleteDebtReliefDTO.personCode, deleteDebtReliefDTO.ip)
            await this.deleteDebtReliefUseCase.execute(creditCode, +idPayment, 'SS012', '0.0.0.0')

            return this.sendResponse(res, 204, {
                code: '00',
                message: 'Debt relief was successfully deleted'
            }, null);
        } catch (error) {
            return this.sendResponse(res, null, null, error as Error);
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
            }, null);
        } catch (error) {
            return this.sendResponse(res, null, null, error as Error);
        }
    };

    private sendResponse(res: Response, statusCode: number | null, responseData: any | null, error: Error | null) {
        if (error) {
            if (error instanceof debtReliefException) {
                statusCode = 400;
                responseData =  {
                    code: '01',
                    message: error.message
                }
            } else {
                statusCode = 500;
                responseData = {
                    code: '99',
                    message: 'Internal Server Error'
                };
            };

            console.log(error)
            console.trace(error)
        };
        
        res.status(statusCode!).json(responseData);
    };
};
