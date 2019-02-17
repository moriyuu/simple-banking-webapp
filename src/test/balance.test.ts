import request from "supertest";
import app from "../app";
import { balancesRef } from "../db";
import { Balance } from "../models";

const TEST_BALANCE_ID = "TEST_BALANCE_ID";
const TEST_BALANCE_ID2 = "TEST_BALANCE_ID2";

beforeAll(() => {
  const doc: Balance = {
    id: TEST_BALANCE_ID,
    amount: 10000,
    createdAt: new Date()
  };
  return balancesRef.doc(TEST_BALANCE_ID).set(doc);
});

afterAll(() => {
  return Promise.all([
    balancesRef.doc(TEST_BALANCE_ID).delete(),
    balancesRef.doc(TEST_BALANCE_ID2).delete()
  ]);
});

describe("POST /v1/balances", () => {
  it("should response 200 OK", async done => {
    const res = await request(app)
      .post("/v1/balances")
      .send({ balanceId: TEST_BALANCE_ID2, amount: 2000 });
    expect(res.status).toBe(200);
    expect(res.body.balance.id).toBe(TEST_BALANCE_ID2);
    expect(res.body.balance.amount).toBe(2000);
    expect(new Date(res.body.balance.createdAt).getTime()).toBeLessThan(
      new Date().getTime()
    );
    done();
  });
});

describe("GET /v1/balances/:balanceId", () => {
  it("should response 200 OK", async done => {
    const balanceId = TEST_BALANCE_ID;
    const res = await request(app).get(`/v1/balances/${balanceId}`);
    expect(res.status).toBe(200);
    expect(res.body.balance.id).toBe(TEST_BALANCE_ID);
    expect(res.body.balance.amount).toBeGreaterThanOrEqual(0);
    expect(new Date(res.body.balance.createdAt).getTime()).toBeLessThan(
      new Date().getTime()
    );
    done();
  });

  it("should response 404 Not Found", async done => {
    const balanceId = "nonexistent_balanceId";
    const res = await request(app).get(`/v1/balances/${balanceId}`);
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("Balance not found");
    done();
  });
});
