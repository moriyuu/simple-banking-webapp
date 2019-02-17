import { Request, Response, NextFunction } from "express";
import { Balance } from "../models";
import db from "../db";

const balancesRef = db.collection("balances");

/**
 * Create a new balance
 */
export const createBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: BalanceCreateRequestBody = req.body;

    const doc: Balance = {
      id: body.balanceId,
      amount: body.amount,
      createdAt: new Date(0)
    };
    await balancesRef
      .doc(body.balanceId + "")
      .create(doc)
      .catch((err: any) => {
        if (err.details.includes("Document already exists")) {
          throw { status: 409, code: "Conflicting balance id" };
        }
        throw { status: 500, code: "Failed to create data" };
      });

    const result: BalanceCreateResponseBody = { balance: doc };
    res.json(result);
  } catch (err) {
    next(err);
  }
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
export const showBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { balanceId } = req.params;

    // Fetch data from firestore
    const docs = await balancesRef
      .where("id", "==", balanceId)
      .get()
      .catch(() => {
        throw { status: 500, code: "Failed to read data" };
      })
      .then(snapshot => {
        return snapshot.docs.map(doc => doc.data());
      });

    // Check if the balance is exist
    if (!docs[0]) {
      throw { status: 404, code: "Balance not found" };
    }

    // Response
    const doc = docs[0];
    const result: BalanceShowResponseBody = {
      balance: {
        id: balanceId,
        amount: doc.amount,
        createdAt: doc.createdAt.toDate()
      }
    };
    res.json(result);
  } catch (err) {
    next(err);
  }
};
interface BalanceShowResponseBody {
  balance: Balance;
}
