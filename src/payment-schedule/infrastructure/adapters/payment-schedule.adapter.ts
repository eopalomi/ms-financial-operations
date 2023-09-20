import axios from 'axios';
import { PaymentShedule } from '../../domain/models/payment-schedule.model';
import { PaymentScheduleRepository } from '../../domain/repositories/payment-schedule.repository';

type Maecuo = {
   cod_cre: string;
   num_cuo: number;
   fec_ven: Date;
   capital: number;
   interes: number;
   cta_seg: number;
   cta_seg_desgra: number;
   cta_igv: number;
   cta_seg_prev: number;
   sal_cap: number;
   sal_int: number;
   sal_mor: number;
   sal_seg: number;
   sal_seg_desgra: number;
   sal_igv: number;
   sal_seg_prev: number;
};

export class PaymentScheduleAdapter implements PaymentScheduleRepository {

   async save(PaymentShedule: Partial<PaymentShedule>): Promise<void> {
      throw new Error('Method not implemented.' + PaymentShedule);
   }

   cancel(): Promise<void> {
      throw new Error('Method not implemented.');
   }

   async find(creditCode: string): Promise<PaymentShedule> {
      const objFilter =
        {
           limit: 240,
           order: 'num_cuo',
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

      const { data: creditInfoResponse } = await axios.get(`${process.env.HOST_NAME_LB}:${process.env.PORT_LB}/credit-information/${creditCode}`);
      const getHttpPath = creditInfoResponse.il_admacc === true ? 'own-payment-schedules' : 'transferred-payment-schedules';

      const encodedPayload = encodeURIComponent(JSON.stringify(objFilter));

      const url = `${process.env.HOST_NAME_LB}:${process.env.PORT_LB}/${getHttpPath}?filter=${encodedPayload}`;


      const { data: schedule } = await axios.get<Maecuo[]>(url);

      const paymentShedule = new PaymentShedule({
         creditCode: schedule[0]?.cod_cre
      });

      schedule.forEach((schedule) => {
         if (schedule.num_cuo > 0) {
            paymentShedule.addInstallmentNumber({
               numberPayment: +schedule.num_cuo,
               paymentDate: String(schedule.fec_ven).substring(0, 10),
               principal: schedule.capital,
               interest: schedule.interes,
               vehicleInsurance: schedule.cta_seg,
               lifeInsurance: schedule.cta_seg_desgra,
               igvInsurance: schedule.cta_igv,
               preventionInsurance: schedule.cta_seg_prev,
               principalBalance: schedule.sal_cap ?? 0.00,
               interestBalance: schedule.sal_int ?? 0.00,
               feesbalance: schedule.sal_mor ?? 0.00,
               vehicleInsuranceBalance: schedule.sal_seg ?? 0.00,
               lifeInsuranceBalance: schedule.sal_seg_desgra ?? 0.00,
               igvInsuranceBalance: schedule.sal_igv ?? 0.00,
               preventionInsuranceBalance: schedule.sal_seg_prev ?? 0.00
            });
         }
      });

      return paymentShedule;
   }

   findAll(): Promise<PaymentShedule[]> {
      throw new Error('Method not implemented.');
   }
}
