import { Request, Response, NextFunction } from "express";
import shortid from "shortid";
import { Deposit, Balance } from "../models";
import db, { depositsRef, balancesRef } from "../db";

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

    // Manipulate firestore using transaction
    const deposit = await db.runTransaction(async t => {
      const balance = await t
        .get(balancesRef.doc(body.balanceId + ""))
        .then(doc => doc.data() as Balance);

      // Check if the balance is exist
      if (!balance) {
        throw { status: 404, code: "Balance not found" };
      }

      // Create deposit data into firestore
      const id = shortid.generate();
      const deposit: Deposit = {
        id,
        balanceId: body.balanceId,
        amount: body.amount,
        createdAt: new Date()
      };
      t.create(depositsRef.doc(id), deposit);

      // Update balance data in firestore
      const newBalance: Balance = {
        ...balance,
        amount: balance.amount + body.amount
      };
      t.update(balancesRef.doc(newBalance.id + ""), newBalance);

      return deposit;
    });

    // Response
    const result: DepositCreateResponseBody = { deposit };
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

    // Fetch data from firestore
    const docs = await depositsRef
      .where("id", "==", depositId)
      .get()
      .catch(() => {
        throw { status: 500, code: "Failed to read data" };
      })
      .then(snapshot => {
        return snapshot.docs.map(doc => doc.data());
      });

    // Check if the deposit is exist
    if (!docs[0]) {
      throw { status: 404, code: "Deposit not found" };
    }

    // Response
    const doc = docs[0];
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
