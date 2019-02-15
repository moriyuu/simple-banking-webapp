import { Request, Response } from "express";
import { Deposit } from "../models";

/**
 * Deposit some amount of money to a balance
 */
export const createDeposit = (req: Request, res: Response) => {
  const body: DepositCreateRequestBody = req.body;
  const result: DepositCreateResponseBody = {
    deposit: {
      id: "fuga",
      balanceId: body.balanceId,
      amount: body.amount,
      createdAt: new Date()
    }
  };
  res.json(result);
};
interface DepositCreateRequestBody {
  balanceId: string | number;
  amount: number;
}
interface DepositCreateResponseBody {
  deposit: Deposit;
}

/**
 * List all deposits
 */
export const listDeposits = (req: Request, res: Response) => {
  const result: DepositListResponseBody = { deposits: [] };
  res.json(result);
};
interface DepositListResponseBody {
  deposits: Deposit[];
}

/**
 * Show a specific deposit
 */
export const showDeposit = (req: Request, res: Response) => {
  const { depositId } = req.params;
  const result: DepositShowResponseBody = {
    deposit: {
      id: depositId,
      balanceId: "bid",
      amount: 1000,
      createdAt: new Date()
    }
  };
  res.json(result);
};
interface DepositShowResponseBody {
  deposit: Deposit;
}
