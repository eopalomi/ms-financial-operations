import { DebtReliefRepository, PaymentSchedule } from '../../domain/repositories/debt-relief.repository';
import { DebtRelief } from '../../domain/model/debt-relief.model';
import { CreditPaymentDTO } from '../DTO/pag_cuo.dto';
import { formatedDate } from '../../../commons/services/date-utils.services';
import { PaymentService } from '../services/payment.service';
import { CreditService } from '../services/credit.service';
import axios from 'axios';
import { debtReliefException } from '../../shared/exceptions/debt-relief.exceptions';
import { PaymentScheduleService } from '../../../payment-schedule/application/service/payment-schedule.service';

export class DebtReliefAdapter implements DebtReliefRepository {
   private lb4Host: string;
   private paymentService: PaymentService;
   private creditService: CreditService;
   private paymentScheduleService: PaymentScheduleService;

   constructor() {
      this.lb4Host = `${process.env.HOST_NAME_LB}:${process.env.PORT_LB}`;
      this.paymentService = new PaymentService();
      this.creditService = new CreditService();
      this.paymentScheduleService = new PaymentScheduleService();
      
   }

   save = async (debtRelief: DebtRelief): Promise<void> => {
      const schedule = await this.findPaymentSchedule(debtRelief.creditCode);
      const dataPaymentNumber = schedule.installments.find((installment)=> installment.numberPayment ===  debtRelief.numberPayment);

      if (!dataPaymentNumber) {
         throw new debtReliefException('paymentNumberQuotaNotFound', 'payment number quota not found');
      }

      const [creditInfo, idReceipt, idPayment] = await Promise.all([
         this.creditService.getCreditInformation(debtRelief.creditCode), 
         this.paymentService.getReceiptCode(),
         this.paymentService.getIdPayment()
      ]);
      
      debtRelief.idPayment = idPayment;
      
      const dateTime = {
         currentDate: () => formatedDate(new Date(), 'yyyy-mm-dd'),
         currentHour: () => formatedDate(new Date(), 'hh:mm:ss AM|PM'),
         now: () => formatedDate(new Date(), 'YYYY-MM-DD_hhmmss'),
      };
      
      const creditPayment: CreditPaymentDTO = this.paymentService.toPayment({
         cod_cre: debtRelief.creditCode,
         num_cuo: debtRelief.numberPayment,
         lug_rec: debtRelief.collectionLocationCode,
         num_ric: idReceipt,
         cod_int: creditInfo.cod_int,
         fec_pag: debtRelief.paymentDate,
         hor_pag: debtRelief.paymentHour,
         fec_doc: debtRelief.paymentValueDate,
         pago: debtRelief.amount,
         pag_cap: debtRelief.principalAmount,
         pag_int: debtRelief.interestAmount,
         pag_seg: debtRelief.vehicleInsurance,
         pag_seg_desgra: debtRelief.lifeInsurance,
         pag_mor: debtRelief.lateFeeAmount,
         pag_itf: 0,
         pag_igv: debtRelief.igvInsurance,
         dia_mor: 0,
         ult_pag: debtRelief.paymentDate,
         enc_cap: dataPaymentNumber.principalBalance,
         enc_int: dataPaymentNumber.interestBalance,
         enc_mor: dataPaymentNumber.feesbalance,
         enc_mor_mor: 0,
         enc_mor_com: 0,
         enc_seg: dataPaymentNumber.vehicleInsuranceBalance,
         enc_seg_desgra: dataPaymentNumber.lifeInsuranceBalance,
         cal_cap: dataPaymentNumber.principalBalance,
         cal_int: dataPaymentNumber.interestBalance,
         cap_por: (dataPaymentNumber.principal - dataPaymentNumber.principalBalance),
         int_por: (dataPaymentNumber.interest - dataPaymentNumber.interestBalance),
         cap_ven: dataPaymentNumber.principalBalance,
         int_ven: dataPaymentNumber.interestBalance,
         fec_reg: dateTime.now(),
         hor_reg: dateTime.currentHour(),
         usu_reg: debtRelief.registeringPersonCode,
         fec_reg_pag: dateTime.now(),
         fec_pag_rea: dateTime.currentDate(),
         tip_pagcuo: debtRelief.paymentType,
         emp_tra: creditInfo.emp_tra,
         emp_ven: creditInfo.emp_ven,
         fue_fin_pag: creditInfo.fue_fin,
         fec_ven_pag: dataPaymentNumber.paymentDate,
         dia_int_ec: 0,
         tip_cam: 1.00,
         cue_ban: null,
         id_pagcre: debtRelief.idPayment,
         fe_propre: dateTime.currentDate(),
         pag_seg_prev: debtRelief.preventionInsurance,
         cod_ds: debtRelief.idDocumentWF,
         usu_aut_con: debtRelief.authorizationPersonCode
      });

      const fieldsForUpdate = {
         sal_cap: dataPaymentNumber.principalBalance - debtRelief.principalAmount,
         sal_int: dataPaymentNumber.interestBalance - debtRelief.interestAmount,
         sal_mor: dataPaymentNumber.feesbalance - debtRelief.lateFeeAmount,
         sal_seg: dataPaymentNumber.vehicleInsuranceBalance - debtRelief.vehicleInsurance,
         sal_seg_desgra: dataPaymentNumber.lifeInsuranceBalance - debtRelief.lifeInsurance,
         sal_seg_prev: dataPaymentNumber.preventionInsuranceBalance - debtRelief.preventionInsurance,
         sal_igv: dataPaymentNumber.igvInsuranceBalance - debtRelief.igvInsurance,
         fec_can: dateTime.currentDate(),
         fec_can_cuo: dateTime.currentDate()
      };
      
      try {
         await axios.post(`${this.lb4Host}/${creditInfo.paymentPath}`, creditPayment);
         await axios.patch(`${this.lb4Host}/${creditInfo.schedulesPath}/${debtRelief.creditCode}/${debtRelief.numberPayment}`, fieldsForUpdate);
      } catch (error) {
         //console.error("Error details : ", error.response.data.error.details);
         throw new Error((error as Error).message);
      }
   };

   delete = async (creditCode: string, idPayment: number, personCode: string, ip:string): Promise<void> => {
      try {
         const creditInfo = await this.creditService.getCreditInformation(creditCode);

         const encodedPath = encodeURIComponent(
            JSON.stringify({
               limit: 200,
               order: 'fec_reg_pag asc',
               where: {
                  cod_cre: creditCode,
                  id_pagcre: idPayment
               }
            })
         );
         
         const { data: paymentsToCancel } = await axios.get<CreditPaymentDTO[]>(
            `${this.lb4Host}/${creditInfo.paymentPath}?filter=` + encodedPath
         );
         
         const paymentCanceledPromises = paymentsToCancel.map(async payments => {
            const idCancel = await this.paymentService.getCanceledPaymentNextId(creditInfo.il_admacc);

            const canceledPayment = {
               codigo: idCancel, 
               cod_per_anu: personCode,
               fec_anu: formatedDate(new Date(), 'YYYY-MM-DD_hhmmss'),
               ip_anu: ip,
               ...payments 
            };

            return axios.post<CreditPaymentDTO[]>(
               `${this.lb4Host}/${creditInfo.cancelPaymentPath}`, 
               this.paymentService.toCancelledPayment(canceledPayment)
            );
         });

         await Promise.all(paymentCanceledPromises);

         await axios.delete(`${this.lb4Host}/${creditInfo.paymentPath}/${creditCode}`, {
            params: {
               id_pagcre: idPayment
            }
         });
      } catch (error) {
         // console.error(error.response)
         throw new Error((error as Error).message);
      }
   };

   find = async (): Promise<DebtRelief> => {
      throw new Error('Method not implemented.');
   };

   findAll = async (creditCode: string): Promise<DebtRelief[]> => {
      const creditInfoResponse = await this.creditService.getCreditInformation(creditCode);

      const encodedPath = encodeURIComponent(
         JSON.stringify({
            limit: 500,
            order: 'fec_reg_pag desc',
            where: {
               cod_cre: creditCode,
               lug_rec: 'C5'
            }
         })
      );

      const { data: payments } = await axios.get<CreditPaymentDTO[]>(
         `${this.lb4Host}/${creditInfoResponse.paymentPath}?filter=` + encodedPath
      );

      const debtReliefs = payments.map(payment => {
         return new DebtRelief({
            creditCode: payment.cod_cre,
            amount: payment.pago,
            numberPayment: payment.num_cuo,
            principalAmount: payment.pag_cap,
            interestAmount: payment.pag_int,
            lateFeeAmount: payment.pag_mor,
            vehicleInsurance: payment.pag_seg,
            lifeInsurance: payment.pag_seg_desgra,
            igvInsurance: payment.pag_igv,
            preventionInsurance: payment.pag_seg_prev,
            collectionLocationCode: payment.lug_rec,
            paymentType: payment.tip_pagcuo,
            banckAccountCode: payment.cue_ban,
            paymentDate: String(payment.fec_pag).substring(0, 10),
            paymentHour: payment.hor_pag,
            paymentValueDate: String(payment.fec_doc).substring(0, 10),
            authorizationPersonCode: payment.usu_aut_con,
            requestingPersonCode: null,
            registeringPersonCode: payment.usu_reg,
            idDocumentWF: payment.cod_ds,
            idPayment: payment.id_pagcre,
         });
      });

      return debtReliefs;
   };

   findPaymentSchedule = async (creditCode:string ): Promise<PaymentSchedule> => {
      const paymentSchedule = await this.paymentScheduleService.findPaymentSchedule(creditCode);

      return paymentSchedule;
   };

}
