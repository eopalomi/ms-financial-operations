import { Pool } from "pg";
import { DebtWaiverRepository } from "../../domain/repositories/debt-waiver.repository";
import { DebtRelief } from "../../domain/model/debt-relief.model";
import axios, { AxiosResponse } from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import { crearDbPostgresDatabase } from "../config/creardb.postgres";
import { creditPaymentInterfaceDTO } from "../DTO/pag_cuo.dto";
import { PaymentScheduleService } from "../../../paymentSchedule/application/service/payment-schedule.service";
import { PaymentScheduleRepositoryHTTP } from "../../../paymentSchedule/infrastructure/repositories/payment-schedule.repository";


export class DebtReliefRepository implements DebtWaiverRepository {
   private readonly pool: Pool;

   constructor() {
      this.pool = crearDbPostgresDatabase.getConnection();
   }

   async save(debtWaiver: Partial<DebtRelief>): Promise<void> {
      const debtReliefProps = {
         creditCode: debtWaiver.creditCode,
         ammount: debtWaiver.ammount,
         numberPayment: debtWaiver.numberPayment,
         principalAmount: debtWaiver.principalAmount,
         interestAmount: debtWaiver.interestAmount,
         lateFeeAmount: debtWaiver.lateFeeAmount,
         collectionLocationCode: debtWaiver.collectionLocationCode,
         banckAccountCode: debtWaiver.banckAccountCode,
         paymentDate: debtWaiver.paymentDate,
         paymentHour: debtWaiver.paymentHour,
         paymentValueDate: debtWaiver.paymentValueDate,
         authorizationPersonCode: debtWaiver.authorizationPersonCode,
         authorizationPersondocumentCode: debtWaiver.authorizationPersondocumentCode
      };

      if (!debtWaiver.creditCode) {
         return;
      }

      const creditPayment: creditPaymentInterfaceDTO = {
         cod_cre: debtWaiver.creditCode!,
         num_cuo: debtWaiver.numberPayment!,
         lug_rec: debtWaiver.collectionLocationCode!,
         num_ric: "91991",
         cod_int: "BG3211",
         fec_pag: String(debtWaiver.paymentDate),
         hor_pag: String(debtWaiver.paymentHour),
         fec_doc: String(debtWaiver.paymentValueDate),
         pago: debtWaiver.ammount!,
         pag_cap: debtWaiver.principalAmount!,
         pag_int: debtWaiver.interestAmount!,
         pag_seg: 0,
         pag_seg_desgra: 0,
         pag_mor: debtWaiver.lateFeeAmount!,
         pag_mor_mor: 0,
         pag_mor_com: 0,
         pag_itf: 0,
         pag_igv: 0,
         dia_int: 0,
         dia_mor: 0,
         cod_ubi: "109",
         tip_ope: "C",
         ult_pag: String(debtWaiver.paymentDate),
         cod_oei: "001",
         enc_cap: 0,
         enc_int: 0,
         enc_mor: 0,
         enc_mor_mor: 0,
         enc_mor_com: 0,
         enc_seg: 0,
         enc_seg_desgra: 0,
         cal_cap: 0,
         cal_int: 0,
         cal_rea: 0,
         cal_mor: 0,
         cal_imo: 0,
         cal_gas: 0,
         cap_por: 0,
         int_por: 0,
         cap_ven: 0,
         int_ven: 0,
         hor_rec: 0,
         vou_eess: 0,
         bru_eess: 0,
         itf_ent: 0,
         itf_sal: 0,
         rec_net: 0,
         com_cof: 0,
         net_tot: 0,
         cod_eess: 0,
         nom_eess: 0,
         swt_tip_pag: "0",
         fec_reg: "2023-07-06T19:37:52.088Z",
         hor_reg: "00:01",
         usu_reg: "PH008",
         fec_reg_pag: "2023-11-17",
         fec_pag_rea: "2023-11-17",
         tip_pagcuo: 0,
         swt_ser: 0,
         can_ant: 0,
         swt_can: "S",
         emp_tra: "",
         emp_ven: "",
         fue_fin_pag: "PR",
         mod_rea_pag: "CC",
         tip_amo_rop: "CN",
         fec_ven_pag: "2023-07-06",
         swt_mig_pag_ven: "I",
         dia_int_ec: 0,
         tip_cam: 0,
         mor_enc: 0,
         cue_ban: "",
         ori_tip_cam: "B",
         swt_pag_ban: "S",
         num_vou_ban: "abc12345",
         id_pagcre: 0,
         co_dispag: 0,
         fe_propre: "2023-07-09",
         pag_bol_int: 0,
         pag_seg_prev: 0
      };

      try {



         const response = await axios.post('http://localhost:3000/own-credit-payments', creditPayment);
         //console.log("response", response)

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

   findAll(): Promise<DebtRelief[]> {
      throw new Error("Method not implemented.");
   }
}
