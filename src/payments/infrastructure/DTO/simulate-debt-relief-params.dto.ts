import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SimulateDebtReliefParamsDTO {
   @IsString()
      creditCode!: string;

   @IsNumber()
      amount!: number;

   @IsString()
      collectionLocationCode!: string;

   @IsString()
   @IsOptional()
      paymentType!: string;

   @IsString()
      paymentDate!: string;

   @IsString()
      paymentHour!: string;

   @IsString()
      paymentValueDate!: string;

   @IsString()
      authorizationPersonCode!: string;

   @IsString()
      requestingPersonCode!: string;

   @IsString()
      registeringPersonCode!: string;

   @IsNumber()
      idDocumentWF!: number;
}