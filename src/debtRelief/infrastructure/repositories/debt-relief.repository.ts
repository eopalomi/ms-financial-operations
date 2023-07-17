import { DebtReliefRepository } from "../../domain/repositories/debt-relief.repository";
import { DebtRelief } from "../../domain/model/debt-relief.model";
import { creditPaymentInterfaceDTO } from "../DTO/pag_cuo.dto";
import { DebtReliefService } from "../../application/services/debt-relief.service";
import { formatedDate } from "../../../commons/services/date-utils.services";
import { PaymentService } from "../services/payment.service";
import { CreditService } from "../services/credit.service";
import axios from 'axios';

export class DebtReliefRepositoryHTTP implements DebtReliefRepository {
   lb4Host : string;
   paymentService: PaymentService;
   creditService: CreditService;

   constructor(private debtReliefService: DebtReliefService) {
      this.lb4Host = `${process.env.HOST_NAME_LB}:${process.env.PORT_LB}`;
      this.paymentService = new PaymentService()
      this.creditService = new CreditService();
   };

   async save(debtRelief: Partial<DebtRelief>): Promise<void> {
      const dataPaymentNumber = await this.debtReliefService.installmentAmounts(debtRelief.creditCode!, debtRelief.numberPayment!);

      if (!dataPaymentNumber){
         throw new Error("payment number quota not found");
      }

      const idReceipt = await this.paymentService.getReceiptCode();
      const creditInfoResponse = await this.creditService.getCreditInformation(debtRelief.creditCode!);
      const idPayment = await this.paymentService.getIdPayment();
      debtRelief.idPayment = idPayment;

      const currentDate: string = formatedDate(new Date(),'yyyy-mm-dd');
      const now: string = formatedDate(new Date(),'YYYY-MM-DD_hhmmss');
      const currentHour: string = formatedDate(new Date(),'hh:mm');
      
      const postHttpPath = creditInfoResponse.il_admacc === true ? 'own-credit-payments' : 'transferred-credit-payments';
      const patchHttpPath = creditInfoResponse.il_admacc === true ? 'own-payment-schedules' : 'transferred-payment-schedules';

      const creditPayment: creditPaymentInterfaceDTO = this.paymentService.toPayment({
         cod_cre: debtRelief.creditCode!,
         num_cuo: debtRelief.numberPayment!,
         lug_rec: debtRelief.collectionLocationCode!,
         num_ric: idReceipt,
         cod_int: String(creditInfoResponse.cod_int),
         fec_pag: String(debtRelief.paymentDate),
         hor_pag: String(debtRelief.paymentHour),
         fec_doc: String(debtRelief.paymentValueDate),
         pago: debtRelief.amount!,
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
         id_pagcre: idPayment,
         fe_propre: currentDate,
         pag_seg_prev: debtRelief.preventionInsurance!,
         cod_ds: debtRelief.idDocumentWF!,
         usu_aut_con: debtRelief.authorizationPersonCode!
      });
      
      const fieldsForUpdate =  {
         sal_cap: dataPaymentNumber.principalBalance - debtRelief.principalAmount!,
         sal_int: dataPaymentNumber.interestBalance - debtRelief.interestAmount!,
         sal_mor: dataPaymentNumber.feesbalance - debtRelief.lateFeeAmount!,
         sal_seg: dataPaymentNumber.vehicleInsuranceBalance - debtRelief.vehicleInsurance!,
         sal_seg_desgra: dataPaymentNumber.lifeInsuranceBalance - debtRelief.lifeInsurance!,
         sal_seg_prev: dataPaymentNumber.preventionInsuranceBalance - debtRelief.preventionInsurance!,
         sal_igv: dataPaymentNumber.igvInsuranceBalance - debtRelief.igvInsurance!,
         fec_can: currentDate,
         fec_can_cuo: currentDate
      }
      
      try {
         await axios.post(`${this.lb4Host}/${postHttpPath}`, creditPayment);
         await axios.patch(`${this.lb4Host}/${patchHttpPath}/${debtRelief.creditCode}/${debtRelief.numberPayment}`, fieldsForUpdate);
      } catch (error: any) {
         console.log("Error details : ", error.response.data.error.details);
         throw new Error(error)
      }
   }

   async delete(creditCode: string, idPayment: number): Promise<void> {
      const creditInfoResponse = await this.creditService.getCreditInformation(creditCode);
      
      const deletePath = creditInfoResponse.il_admacc === true ? 'own-credit-payments' : 'transferred-credit-payments';

      try {
         await axios.delete(`${this.lb4Host}/${deletePath}/${creditCode}`,{
            params: {
               id_pagcre: idPayment
            }
         });   
      } catch (error: any) {
         console.error(error.response)
         throw new Error('an error ocurred while delete the payment');
      }
   }

   async find(): Promise<DebtRelief> {
      throw new Error("Method not implemented.");
   }

   async findAll(creditCode: string): Promise<DebtRelief[]> {
      const creditInfoResponse = await this.creditService.getCreditInformation(creditCode);
      
      const findPath = creditInfoResponse.il_admacc === true ? 'own-credit-payments' : 'transferred-credit-payments';

      const whereFfilter = {
         offset: 0,
         limit: 500,
         skip: 0,
         order: "num_cuo asc",
         where: {
           cod_cre: creditCode,
           lug_rec: "C5"
         }
       };

       const encodedPath = encodeURIComponent(JSON.stringify(whereFfilter));

       const {data: response} = await axios.get<any[]>(`${this.lb4Host}/${findPath}?filter=`+encodedPath)

       const debtReliefs = response.map(payment =>{
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
            paymentDate: payment.fec_pag,
            paymentHour: payment.hor_pag,
            paymentValueDate: payment.fec_doc,
            authorizationPersonCode: payment.usu_aut_con,
            requestingPersonCode: payment.usu_reg,
            registeringPersonCode: payment.cod_per,
            idDocumentWF: payment.cod_ds,
            idPayment: payment.id_pagcre,
         })
       })

      return debtReliefs;
   }
}
