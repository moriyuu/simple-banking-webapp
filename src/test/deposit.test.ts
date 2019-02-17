import request from "supertest";
import shortid from "shortid";
import app from "../app";
import { balancesRef } from "../db";
import { Balance } from "../models";

const TEST_BALANCE_ID = "TEST_BALANCE_ID_" + shortid.generate();

beforeAll(() => {
  const doc: Balance = {
    id: TEST_BALANCE_ID,
    amount: 10000,
    createdAt: new Date()
  };
  return balancesRef.doc(TEST_BALANCE_ID).create(doc);
});

afterAll(() => {
  return balancesRef.doc(TEST_BALANCE_ID).delete();
});

describe("POST /v1/deposits", () => {
  it("should response 200 OK", async done => {
    const res = await request(app)
      .post("/v1/deposits")
      .send({ balanceId: TEST_BALANCE_ID, amount: 25000 });
    expect(res.status).toBe(200);
    expect(res.body.deposit.id).not.toBeUndefined();
    expect(res.body.deposit.balanceId).toBe(TEST_BALANCE_ID);
    expect(res.body.deposit.amount).toBe(25000);
    expect(new Date(res.body.deposit.createdAt).getTime()).toBeLessThan(
      new Date().getTime()
    );
    done();
  });
});

describe("GET /v1/deposits", () => {
  it("should response 200 OK", async done => {
    const res = await request(app).get("/v1/deposits");
    expect(res.status).toBe(200);
    expect(res.body.deposits[0].id).toBe("valid-balanceId");
    expect(res.body.deposits[0].amount).toBeGreaterThanOrEqual(0);
    expect(new Date(res.body.deposits[0].createdAt).getTime()).toBeLessThan(
      new Date().getTime()
    );
    done();
  });
});

describe("GET /v1/deposits/:depositId", () => {
  it("should response 200 OK", async done => {
    const depositId = "valid-depositId";
    const res = await request(app).get(`/v1/deposits/${depositId}`);
    expect(res.status).toBe(200);
    expect(res.body.deposit.id).toBe("valid-depositId");
    expect(res.body.deposit.balanceId).toBe("valid-balanceId");
    expect(res.body.deposit.amount).toBeGreaterThanOrEqual(0);
    expect(new Date(res.body.deposit.createdAt).getTime()).toBeLessThan(
      new Date().getTime()
    );
    done();
  });

  it("should response 404 Not Found", async done => {
    const depositId = "nonexistent-depositId";
    const res = await request(app).get(`/v1/deposits/${depositId}`);
    expect(res.status).toBe(404);
    done();
  });
});
