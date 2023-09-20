import { IsString, IsNumber } from 'class-validator';

export class DeleteDebtReliefDTO {
   @IsNumber()
      idPayment!: number;

   @IsString()
      personCode!: string;

   @IsString()
      ip!: string;
}