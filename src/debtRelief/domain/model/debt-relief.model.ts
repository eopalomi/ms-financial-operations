export class DebtRelief {
  public readonly creditCode: string;
  public readonly ammount: number;
  public readonly numberPayment: number;
  public readonly principalAmount: number;
  public readonly interestAmount: number;
  public readonly lateFeeAmount: number;
  public readonly vehicleInsurance: number;
  public readonly lifeInsurance: number;
  public readonly igvInsurance: number;
  public readonly preventionInsurance: number;
  public readonly collectionLocationCode: string;
  public readonly paymentType: string | null;
  public readonly banckAccountCode: string | null;
  public readonly paymentDate: Date;
  public readonly paymentHour: Date;
  public readonly paymentValueDate: Date;
  public readonly authorizationPersonCode: string;
  public readonly requestingPersonCode: string | null;
  public readonly registeringPersonCode: string;
  public readonly authorizationPersondocumentCode: string;
  public readonly idDocumentWF: number | null;
  public readonly idPayment?: number | null;

  public constructor(constructor: {
    creditCode: string,
    ammount: number,
    numberPayment: number,
    principalAmount: number,
    interestAmount: number,
    lateFeeAmount: number,
    vehicleInsurance: number,
    lifeInsurance: number,
    igvInsurance: number,
    preventionInsurance: number,
    collectionLocationCode: string,
    paymentType: string | null,
    banckAccountCode: string,
    paymentDate: Date,
    paymentHour: Date,
    paymentValueDate: Date,
    authorizationPersonCode: string,
    requestingPersonCode: string | null,
    registeringPersonCode: string,
    authorizationPersondocumentCode: string,
    idDocumentWF: number | null,
    idPayment?: number | null,
  }) {
    this.creditCode = constructor.creditCode;
    this.ammount = constructor.ammount;
    this.numberPayment = constructor.numberPayment;
    this.principalAmount = constructor.principalAmount;
    this.interestAmount = constructor.interestAmount;
    this.lateFeeAmount = constructor.lateFeeAmount;
    this.vehicleInsurance = constructor.vehicleInsurance;
    this.lifeInsurance = constructor.lifeInsurance;
    this.igvInsurance = constructor.igvInsurance;
    this.preventionInsurance = constructor.preventionInsurance;
    this.collectionLocationCode = constructor.collectionLocationCode;
    this.paymentType = constructor.paymentType;
    this.banckAccountCode = constructor.banckAccountCode;
    this.paymentDate = constructor.paymentDate;
    this.paymentHour = constructor.paymentHour;
    this.paymentValueDate = constructor.paymentValueDate;
    this.authorizationPersonCode = constructor.authorizationPersonCode;
    this.requestingPersonCode = constructor.requestingPersonCode;
    this.registeringPersonCode = constructor.registeringPersonCode;
    this.authorizationPersondocumentCode = constructor.authorizationPersondocumentCode;
    this.idDocumentWF = constructor.idDocumentWF;
    this.idPayment = constructor.idPayment;
  }
}
