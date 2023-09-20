import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDebtReliefDTO {
   @IsString()
      creditCode!: string;

   @IsNumber()
      amount!: number;

   @IsNumber()
      numberPayment!: number;

   @IsNumber()
      principalAmount!: number;

   @IsNumber()
      interestAmount!: number;

   @IsNumber()
      lateFeeAmount!: number;

   @IsNumber()
      vehicleInsurance!: number;

   @IsNumber()
      lifeInsurance!: number;

   @IsNumber()
      igvInsurance!: number;

   @IsNumber()
      preventionInsurance!: number;

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
