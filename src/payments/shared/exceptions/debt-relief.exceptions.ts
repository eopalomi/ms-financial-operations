type DebtReliefErrorTypes =
    | 'default'
    | 'invalidFormatPaymentHour'
    | 'invalidFormatPaymentDate'
    | 'invalidFormatPaymentValueDate'
    | 'creditCodeEmpty'
    | 'idPaymentIsEmpty'
    | 'paymentNumberQuotaNotFound'
    | 'invalidArrayBodyRequest'
    | 'paymentInstallmentNumberNotFound'
    | 'amountGreaterBalance';

const exceptionsFactory = () => {
   return class CustomExceptionsFactory extends Error {
      public readonly errorType: DebtReliefErrorTypes;

      constructor(errorType: DebtReliefErrorTypes, message: string) {
         super(message);

         this.errorType = errorType;
      }
   };
};

export const debtReliefException = exceptionsFactory();
