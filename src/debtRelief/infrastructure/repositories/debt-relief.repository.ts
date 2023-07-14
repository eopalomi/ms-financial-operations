import { Pool } from "pg";
import { DebtReliefRepository } from "../../domain/repositories/debt-relief.repository";
import { DebtRelief } from "../../domain/model/debt-relief.model";
import axios from 'axios';
import { creditPaymentInterfaceDTO } from "../DTO/pag_cuo.dto";
import { DebtReliefService } from "../../application/services/debt-relief.service";
import { formatedDate } from "../../../commons/services/date-utils.services";
import { toPayment } from "../services/payment.service";

export class DebtReliefRepositoryHTTP implements DebtReliefRepository {
   constructor(private debtReliefService: DebtReliefService) {}

   async save(debtRelief: Partial<DebtRelief>): Promise<void> {
      const {data: dataResponse } = await axios.get(`${process.env.HOST_NAME_LB}:${process.env.PORT_LB}/receipt-number/C5/1`);
      const {data: creditInfoResponse } = await axios.get(`${process.env.HOST_NAME_LB}:${process.env.PORT_LB}/credit-information/${debtRelief.creditCode}`);
      const {data: dataProces } = await axios.get(`${process.env.HOST_NAME_LB}:${process.env.PORT_LB}/payment-process`);
      
      const dataPaymentNumber = await this.debtReliefService.installmentAmounts(debtRelief.creditCode!, debtRelief.numberPayment!);

      if (!dataPaymentNumber){
         return;
      }

      const currentDate: string = formatedDate(new Date(),'yyyy-mm-dd');
      const now: string = formatedDate(new Date(),'YYYY-MM-DD_hhmmss');
      const currentHour: string = formatedDate(new Date(),'hh:mm');

      const creditPayment: creditPaymentInterfaceDTO = toPayment({
         cod_cre: debtRelief.creditCode!,
         num_cuo: debtRelief.numberPayment!,
         lug_rec: debtRelief.collectionLocationCode!,
         num_ric: String(dataResponse.idReceipt),
         cod_int: String(creditInfoResponse.cod_int),
         fec_pag: String(debtRelief.paymentDate),
         hor_pag: String(debtRelief.paymentHour),
         fec_doc: String(debtRelief.paymentValueDate),
         pago: debtRelief.ammount!,
         pag_cap: debtRelief.principalAmount!,
         pag_int: debtRelief.interestAmount!,
         pag_seg: debtRelief.vehicleInsurance!,
         pag_seg_desgra: debtRelief.lifeInsurance!,
         pag_mor: debtRelief.lateFeeAmount!,
         pag_itf: 0,
         pag_igv: debtRelief.igvInsurance!,
         dia_mor: 0,
         ult_pag: debtRelief.paymentDate ? String(debtRelief.paymentDate) : null,
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
         fec_reg: now,
         hor_reg: currentHour,
         usu_reg: debtRelief.registeringPersonCode!,
         fec_reg_pag: now,
         fec_pag_rea: currentDate,
         tip_pagcuo: debtRelief.paymentType!,
         emp_tra: creditInfoResponse.emp_tra,
         emp_ven: creditInfoResponse.emp_ven,
         fue_fin_pag: creditInfoResponse.fue_fin,
         fec_ven_pag: dataPaymentNumber.paymentDate,
         dia_int_ec: 0,
         tip_cam: 1.00,
         cue_ban: null,
         id_pagcre: dataProces.id_pagcre,
         fe_propre: currentDate,
         pag_seg_prev: debtRelief.preventionInsurance!,
         cod_ds: debtRelief.idDocumentWF!,
         usu_aut_con: debtRelief.authorizationPersonCode!
      });
      
      try {
         const response = await axios.post(`${process.env.HOST_NAME_LB}:${process.env.PORT_LB}/own-credit-payments`, creditPayment);
      } catch (error: any) {
         console.log("Error details : ", error.response.data.error.details)
         throw new Error(error)
      }
   }

   cancel(): Promise<void> {
      throw new Error("Method not implemented.");
   }

   async find(): Promise<DebtRelief> {
      throw new Error("Method not implemented.");
   }

   async findAll(creditCode: string): Promise<DebtRelief[]> {
      const whereFfilter = {
         offset: 0,
         limit: 500,
         skip: 0,
         order: "fec_pag desc",
         where: {
           cod_cre: creditCode,
           lug_rec: "C5"
         }
       };

       const encodedPath = encodeURIComponent(JSON.stringify(whereFfilter));

       const {data: response} = await axios.get<any[]>(`${process.env.HOST_NAME_LB}:${process.env.PORT_LB}/own-credit-payments?filter=`+encodedPath)

       const debtReliefs = response.map(payment =>{
         return new DebtRelief({
            creditCode: payment.cod_cre,
            ammount: payment.pago,
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
            paymentDate: payment.fec_pag,
            paymentHour: payment.hor_pag,
            paymentValueDate: payment.fec_doc,
            authorizationPersonCode: payment.usu_aut_con,
            requestingPersonCode: null,
            registeringPersonCode: payment.cod_per,
            authorizationPersondocumentCode: payment.usu_reg,
            idDocumentWF: payment.cod_ds,
            idPayment: payment.id_pagcre,
         })
       })

      return debtReliefs;
   }
}
