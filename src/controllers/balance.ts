import { Request, Response } from "express";
import { Balance } from "../models";

/**
 * Create a new balance
 */
export const createBalance = (req: Request, res: Response) => {
  const body: BalanceCreateRequestBody = req.body;
  const result: BalanceCreateResponseBody = {
    balance: { id: body.balanceId, amount: body.amount, createdAt: new Date() }
  };
  res.json(result);
};
interface BalanceCreateRequestBody {
  balanceId: string | number;
  amount: number;
}
interface BalanceCreateResponseBody {
  balance: Balance;
}

/**
 * Show balance
 */
export const showBalance = (req: Request, res: Response) => {
  const { balanceId } = req.params;
  const result: BalanceShowResponseBody = {
    balance: { id: balanceId, amount: 1000, createdAt: new Date() }
  };
  res.json(result);
};
interface BalanceShowResponseBody {
  balance: Balance;
}
