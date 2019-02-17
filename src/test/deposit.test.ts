import request from "supertest";
import shortid from "shortid";
import app from "../app";
import { balancesRef, depositsRef } from "../db";
import { Balance, Deposit } from "../models";

const TEST_BALANCE_ID = "TEST_BALANCE_ID_" + shortid.generate();
const TEST_BALANCE: Balance = {
  id: TEST_BALANCE_ID,
  amount: 10000,
  createdAt: new Date()
};
const TEST_DEPOSIT_ID = "TEST_DEPOSIT_ID_" + shortid.generate();
const TEST_DEPOSIT: Deposit = {
  id: TEST_DEPOSIT_ID,
  balanceId: TEST_BALANCE_ID,
  amount: 1000,
  createdAt: new Date()
};

beforeAll(async () => {
  await balancesRef.doc(TEST_BALANCE_ID).create(TEST_BALANCE);
  return depositsRef.doc(TEST_DEPOSIT_ID).create(TEST_DEPOSIT);
});

afterAll(async () => {
  const deposits = await depositsRef
    .where("balanceId", "==", TEST_BALANCE_ID)
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => doc.data());
    });

  return Promise.all([
    balancesRef.doc(TEST_BALANCE_ID).delete(),
    depositsRef.doc(TEST_DEPOSIT_ID).delete(),
    ...deposits.map(deposit => depositsRef.doc(deposit.id).delete())
  ]);
});

describe("POST /v1/deposits", () => {
  it("should response 200 OK", async done => {
    const depositRes = await request(app)
      .post("/v1/deposits")
      .send({ balanceId: TEST_BALANCE_ID, amount: 25000 });
    expect(depositRes.status).toBe(200);
    expect(depositRes.body.deposit.id).not.toBeUndefined();
    expect(depositRes.body.deposit.balanceId).toBe(TEST_BALANCE_ID);
    expect(depositRes.body.deposit.amount).toBe(25000);
    expect(new Date(depositRes.body.deposit.createdAt).getTime()).toBeLessThan(
      new Date().getTime()
    );
    const balanceRes = await request(app).get(
      `/v1/balances/${TEST_BALANCE_ID}`
    );
    expect(balanceRes.status).toBe(200);
    expect(balanceRes.body.balance.amount).toBe(TEST_BALANCE.amount + 25000);
    done();
  });

  it("should response 400 Invalid amount", async done => {
    const res = await request(app)
      .post("/v1/deposits")
      .send({ balanceId: TEST_BALANCE_ID, amount: -1000 });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("Invalid amount");
    done();
  });

  it("should response 404 Balance not found", async done => {
    const res = await request(app)
      .post("/v1/deposits")
      .send({ balanceId: TEST_BALANCE_ID + "_FOO", amount: 10000 });
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("Balance not found");
    done();
  });
});

describe("GET /v1/deposits", () => {
  it("should response 200 OK", async done => {
    const res = await request(app).get("/v1/deposits");
    expect(res.status).toBe(200);
    expect(
      res.body.deposits.find(
        (deposit: Deposit) => deposit.id === TEST_DEPOSIT_ID
      )
    ).toMatchObject({
      id: TEST_DEPOSIT.id,
      balanceId: TEST_DEPOSIT.balanceId,
      amount: TEST_DEPOSIT.amount
    });
    done();
  });
});

describe("GET /v1/deposits/:depositId", () => {
  it("should response 200 OK", async done => {
    const res = await request(app).get(`/v1/deposits/${TEST_DEPOSIT.id}`);
    expect(res.status).toBe(200);
    expect(res.body.deposit.id).toBe(TEST_DEPOSIT.id);
    expect(res.body.deposit.balanceId).toBe(TEST_DEPOSIT.balanceId);
    expect(res.body.deposit.amount).toBe(TEST_DEPOSIT.amount);
    expect(new Date(res.body.deposit.createdAt).getTime()).toBe(
      TEST_DEPOSIT.createdAt.getTime()
    );
    done();
  });

  it("should response 404 Deposit not found", async done => {
    const res = await request(app).get(
      `/v1/deposits/${TEST_DEPOSIT_ID + "_FOO"}`
    );
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("Deposit not found");
    done();
  });
});
