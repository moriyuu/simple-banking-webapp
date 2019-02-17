import { Request, Response, NextFunction } from "express";
import shortid from "shortid";
import { Deposit } from "../models";
import db from "../db";

const depositsRef = db.collection("deposits");
const balancesRef = db.collection("balances");

/**
 * Deposit some amount of money to a balance
 */
export const createDeposit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: DepositCreateRequestBody = req.body;

    // Check if the amount is valid
    if (body.amount <= 0) {
      throw { status: 400, code: "Invalid amount" };
    }

    // Check if the balance is exist
    await balancesRef
      .where("id", "==", body.balanceId)
      .get()
      .catch(() => {
        throw { status: 500, code: "Failed to read balance data!" };
      })
      .then(snapshot => {
        if (!snapshot.docs.length) {
          throw { status: 404, code: "Balance not found" };
        }
      });

    // Define a document
    const id = shortid.generate();
    const doc: Deposit = {
      id,
      balanceId: body.balanceId,
      amount: body.amount,
      createdAt: new Date()
    };

    // Insert into firestore
    await depositsRef
      .doc(id)
      .create(doc)
      .catch(() => {
        throw { status: 500, code: "Failed to create data" };
      });

    // Response
    const result: DepositCreateResponseBody = { deposit: doc };
    res.json(result);
  } catch (err) {
    next(err);
  }
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
export const listDeposits = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: DepositListResponseBody = { deposits: [] };
  res.json(result);
};
interface DepositListResponseBody {
  deposits: Deposit[];
}

/**
 * Show a specific deposit
 */
export const showDeposit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
