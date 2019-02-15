export interface Balance {
  id: number | string;
  amount: number;
  createdAt: Date;
}

export interface Deposit {
  id: number | string;
  balanceId: number | string;
  amount: number;
  createdAt: Date;
}
