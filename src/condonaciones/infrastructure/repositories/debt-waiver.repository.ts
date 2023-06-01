import { Pool } from "pg";
import { DebtWaiverRepository } from "../../domain/repositories/debt-waiver.repository";
import { DebtWaiver } from "../../domain/model/debt-waiver.model";

export class DebtWaiverPostgresRepository implements DebtWaiverRepository {
   private readonly pool: Pool;

   constructor(pool: Pool) {
      this.pool = pool;
   }

   async save(debtWaiver: Partial<DebtWaiver>): Promise<void> {
      const client = await this.pool.connect();
      const debtWaiverFields = []

      debtWaiverFields.push(debtWaiver.creditCode);
      debtWaiverFields.push(debtWaiver.numberPayment);
      debtWaiverFields.push(debtWaiver.codeCollectionPoint);
      debtWaiverFields.push('9999999');
      debtWaiverFields.push('abcabc');
      debtWaiverFields.push('abcabc');

      try {
         await client.query('BEGIN');

         const insertQuery = `
            insert into pag_cuo (
               cod_cre, num_cuo, lug_rec, num_ric, cod_int, fec_pag, hor_pag, fec_doc, pago, pag_cap,
               pag_int, pag_seg, pag_seg_desgra, pag_mor, pag_mor_mor, pag_mor_com, pag_itf, pag_igv, dia_int, dia_mor,
               cod_ubi, lug_rec, tip_ope, ult_pag, cod_oei, enc_cap, enc_int, enc_mor, enc_mor_mor, enc_mor_com,
               enc_seg, enc_seg_desgra, enc_bol, enc_seg_prev, cal_cap, cal_int, cal_rea, cal_mor, cal_imo, cal_gas
               cap_por, int_por, cap_ven, int_ven, hor_rec, vou_eess, bru_eess, itf_ent, itf_sal, rec_net,
               com_cof, net_tot, cod_eess, nom_eess, swt_tip_pag, fec_reg, hor_reg, usu_reg, fec_reg_pag, fec_pag_rea,
               tip_pagcuo, swt_ser, can_ant, swt_can, emp_tra, emp_ven, fue_fin_pag, mod_rea_pag, tip_amo_rop, fec_ven_pag,
               swt_mig_pag_ven, dia_int_ec, tip_camc, mor_enc, cue_ban, ori_tip_cam, swt_pag_ban, num_vou_ban, id_pagcre, co_dispag,
               fe_propre, pag_bol_int, pag_seg_prev, com_acc_ig, com_cli_ig, imp_pre_ig
            ) values (
               $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
               $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
               $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
               $31,$32,$33,$34,$35,$36,$37,$38,$39,$40,
               $41,$42,$43,$44,$45,$46,$47,$48,$49,$50,
               $51,$52,$53,$54,$55,$56,$57,$58,$59,$60,
               $61,$62,$63,$64,$65,$66,$67,$68,$69,$70,
               $71,$72,$73,$74,$75,$76,$77,$78,$79,$80,
               $81,$82,$83,$84,$85,$86
            )
         `;

         await client.query(insertQuery, []);

         await client.query('COMMIT');
      } catch (error) {
         console.log(error)
      }
   }

   cancel(): Promise<void> {
      throw new Error("Method not implemented.");
   }
   find(): Promise<DebtWaiver> {
      throw new Error("Method not implemented.");
   }
   findAll(): Promise<DebtWaiver[]> {
      throw new Error("Method not implemented.");
   }
}
