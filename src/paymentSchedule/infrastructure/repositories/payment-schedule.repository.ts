import axios, { AxiosResponse } from 'axios';
import { PaymentShedule } from "../../domain/models/payment-schedule.model";
import { PaymentScheduleRepository } from '../../domain/repositories/payment-schedule.repository';
import { PaymentInstallment } from '../../domain/models/payment-installment.model';
import { forEach } from 'lodash';

export class PaymentScheduleRepositoryHTTP implements PaymentScheduleRepository {

    constructor() { }

    async save(PaymentShedule: Partial<PaymentShedule>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    cancel(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async find(creditCode: string): Promise<any> {
        const objFilter =
        {
            offset: 0,
            limit: 240,
            skip: 0,
            order: "",
            where: {
                cod_cre: creditCode
            },
            fields: {
                cod_cre: true,
                fec_ven: true,
                num_cuo: true,
                capital: true,
                interes: true,
                cta_seg: true,
                cta_seg_desgra: true,
                cta_igv: true,
                cta_seg_prev: true,
                sal_cap: true,
                sal_int: true,
                sal_mor: true,
                sal_seg: true,
                sal_seg_desgra: true,
                sal_seg_prev: true,
                sal_igv: true
            }
        };
        
        const {data: creditInfoResponse } = await axios.get(`${process.env.HOST_NAME_LB}:${process.env.PORT_LB}/credit-information/${creditCode}`);
        const getHttpPath = creditInfoResponse.il_admacc === true ? 'own-payment-schedules' : 'transferred-payment-schedules';
        
        const encodedPayload = encodeURIComponent(JSON.stringify(objFilter));

        const url = `${process.env.HOST_NAME_LB}:${process.env.PORT_LB}/${getHttpPath}?filter=${encodedPayload}`;        
        
        const { data: response } = await axios.get<any[]>(url);
        
        let paymentShedule = new PaymentShedule({
            creditCode: response[0]?.cod_cre
        });

        response.forEach((schedule) => {
            paymentShedule.addInstallmentNumber({
                numberPayment: parseInt(schedule.num_cuo),
                paymentDate: String(schedule.fec_ven).substring(0,10),
                principal: parseFloat(schedule.capital),
                interest: parseFloat(schedule.interes),
                vehicleInsurance: parseFloat(schedule.cta_seg),
                lifeInsurance: parseFloat(schedule.cta_seg_desgra),
                igvInsurance: parseFloat(schedule.cta_igv),
                preventionInsurance: parseFloat(schedule.cta_seg_prev),
                principalBalance: parseFloat(schedule.sal_cap),
                interestBalance: parseFloat(schedule.sal_int),
                feesbalance: parseFloat(schedule.sal_mor),
                vehicleInsuranceBalance: parseFloat(schedule.sal_seg),
                lifeInsuranceBalance: parseFloat(schedule.sal_seg_desgra),
                igvInsuranceBalance: parseFloat(schedule.sal_igv),
                preventionInsuranceBalance: parseFloat(schedule.sal_seg_prev)
            })
        });
        
        return paymentShedule;
    }

    findAll(): Promise<PaymentShedule[]> {
        throw new Error("Method not implemented.");
    }
}
