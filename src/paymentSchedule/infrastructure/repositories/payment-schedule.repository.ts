import axios, { AxiosResponse } from 'axios';
import * as qs from 'qs';
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
            limit: 100,
            skip: 0,
            order: "",
            where: {
                cod_cre: "D6802003"
            },
            fields: {
                cod_cre: true,
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
        }

        const parametrosConsulta = qs.stringify(objFilter);
        // const url = 'http://localhost:3000/own-payment-schedules?filter=' + parametrosConsulta;
        const url = 'http://[::1]:3000/own-payment-schedules?filter=%7B%0A%20%20%22offset%22%3A%200%2C%0A%20%20%22limit%22%3A%20100%2C%0A%20%20%22skip%22%3A%200%2C%0A%20%20%22order%22%3A%20%22%22%2C%0A%20%20%22where%22%3A%20%7B%0A%20%20%20%20%22cod_cre%22%3A%20%22D6802003%22%0A%20%20%7D%2C%0A%20%20%22fields%22%3A%20%7B%0A%20%20%20%20%22cod_cre%22%3A%20true%2C%0A%20%20%20%20%22num_cuo%22%3A%20true%2C%0A%20%20%20%20%22capital%22%3A%20true%2C%0A%20%20%20%20%22interes%22%3A%20true%2C%0A%20%20%20%20%22cta_seg%22%3A%20true%2C%0A%20%20%20%20%22cta_seg_desgra%22%3A%20true%2C%0A%20%20%20%20%22cta_igv%22%3A%20true%2C%0A%20%20%20%20%22cta_seg_prev%22%3A%20true%2C%0A%20%20%20%20%22sal_cap%22%3A%20true%2C%0A%20%20%20%20%22sal_int%22%3A%20true%2C%0A%20%20%20%20%22sal_mor%22%3A%20true%2C%0A%20%20%20%20%22sal_seg%22%3A%20true%2C%0A%20%20%20%20%22sal_seg_desgra%22%3A%20true%2C%0A%20%20%20%20%22sal_seg_prev%22%3A%20true%2C%0A%20%20%20%20%22sal_igv%22%3A%20true%0A%20%20%7D%0A%7D';

        const { data: response } = await axios.get<any[]>(url);

        let paymentShedule = new PaymentShedule({
            creditCode: response[0].cod_cre
        });

        response.forEach((schedule) => {
            paymentShedule.addInstallmentNumber({
                numberPayment: schedule.num_cuo,
                principal: schedule.capital,
                interest: schedule.interes,
                vehicleInsurance: schedule.cta_seg,
                lifeInsurance: schedule.cta_seg_desgra,
                igvInsurance: schedule.cta_igv,
                preventionInsurance: schedule.cta_seg_prev,
                principalBalance: schedule.sal_cap,
                interestBalance: schedule.sal_int,
                feesbalance: schedule.sal_mor,
                vehicleInsuranceBalance: schedule.sal_seg,
                lifeInsuranceBalance: schedule.sal_seg_desgra,
                igvInsuranceBalance: schedule.sal_igv,
                preventionInsuranceBalance: schedule.sal_seg_prev
            })
        })

        console.log("llego aqui: ", paymentShedule);

        return paymentShedule;
    }

    findAll(): Promise<PaymentShedule[]> {
        throw new Error("Method not implemented.");
    }
}
