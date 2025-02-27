export interface Transaction {
  transactionId: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  fromAccount: {
    _id: string;
    userID: string;
    name: string;
  };
  toAccount: {
    _id: string;
    userID: string;
    name: string;
  };
  fee: number;
  transactionType: "sendMoney" | "cashOut" | "cashIn";
}
