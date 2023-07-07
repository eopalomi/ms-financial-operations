import { Request, Response } from "express";
import { FindPaymentScheduleUsecase } from "../../application/find-payment-schedule.use-case";

export class PaymentScheduleController {
    constructor(private findPaymentScheduleUsecase: FindPaymentScheduleUsecase) { }

    findPaymentSchedule = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const paymentSchedule = await this.findPaymentScheduleUsecase.execute(id);

            res.status(200).json({
                code: '00',
                message: 'successfully',
                data: paymentSchedule
            })
        } catch (error: any) {
            throw new Error(error)
        }
    };

}