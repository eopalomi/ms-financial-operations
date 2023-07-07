export class DebtRelief {
  public readonly creditCode: string;
  public readonly ammount: number;
  public readonly numberPayment: number;
  public readonly principalAmount: number;
  public readonly interestAmount: number;
  public readonly lateFeeAmount: number;
  public readonly collectionLocationCode: string;
  public readonly banckAccountCode: string | null;
  public readonly paymentDate: Date;
  public readonly paymentHour: Date;
  public readonly paymentValueDate: Date;
  public readonly authorizationPersonCode: string;
  public readonly authorizationPersondocumentCode: string;

  public constructor(constructor: {
    creditCode: string,
    ammount: number,
    numberPayment: number,
    principalAmount: number,
    interestAmount: number,
    lateFeeAmount: number,
    collectionLocationCode: string,
    banckAccountCode: string,
    paymentDate: Date,
    paymentHour: Date,
    paymentValueDate: Date,
    authorizationPersonCode: string,
    authorizationPersondocumentCode: string,
  }) {
    this.creditCode = constructor.creditCode;
    this.ammount = constructor.ammount;
    this.numberPayment = constructor.numberPayment;
    this.principalAmount = constructor.principalAmount;
    this.interestAmount = constructor.interestAmount;
    this.lateFeeAmount = constructor.lateFeeAmount;
    this.collectionLocationCode = constructor.collectionLocationCode;
    this.banckAccountCode = constructor.banckAccountCode;
    this.paymentDate = constructor.paymentDate;
    this.paymentHour = constructor.paymentHour;
    this.paymentValueDate = constructor.paymentValueDate;
    this.authorizationPersonCode = constructor.authorizationPersonCode;
    this.authorizationPersondocumentCode = constructor.authorizationPersondocumentCode;
  }
}
