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
export const listDeposits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const docs = await depositsRef
      .get()
      .catch(() => {
        throw { status: 500, code: "Failed to read data" };
      })
      .then(snapshot => {
        return snapshot.docs.map(doc => doc.data());
      });

    const result: DepositListResponseBody = {
      deposits: docs.map(doc => ({
        id: doc.id,
        balanceId: doc.balanceId,
        amount: doc.amount,
        createdAt: doc.createdAt.toDate()
      }))
    };
    res.json(result);
  } catch (err) {
    next(err);
  }
};
interface DepositListResponseBody {
  deposits: Deposit[];
}

/**
 * Show a specific deposit
 */
export const showDeposit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { depositId } = req.params;

    const docs = await depositsRef
      .where("id", "==", depositId)
      .get()
      .then(snapshot => {
        return snapshot.docs;
      })
      .catch(() => {
        throw { status: 500, code: "Failed to read data" };
      });

    if (!docs[0]) {
      throw { status: 404, code: "Deposit not found" };
    }

    const doc = docs[0].data();

    const result: DepositShowResponseBody = {
      deposit: {
        id: depositId,
        balanceId: doc.balanceId,
        amount: doc.amount,
        createdAt: doc.createdAt.toDate()
      }
    };
    res.json(result);
  } catch (err) {
    next(err);
  }
};
interface DepositShowResponseBody {
  deposit: Deposit;
}
