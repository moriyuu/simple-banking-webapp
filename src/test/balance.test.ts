import request from "supertest";
import app from "../app";

describe("POST /v1/balances", () => {
  it("should response 200 OK", async done => {
    const res = await request(app)
      .post("/v1/balances")
      .send({ balanceId: "foobar", amount: 2000 });
    expect(res.status).toBe(200);
    expect(res.body.balance.id).toBe("foobar");
    expect(res.body.balance.amount).toBe(2000);
    expect(new Date(res.body.balance.createdAt).getTime()).toBeLessThan(
      new Date().getTime()
    );
    done();
  });
});

describe("GET /v1/balances/:balanceId", () => {
  it("should response 200 OK", async done => {
    const balanceId = "valid-balanceId";
    const res = await request(app).get(`/v1/balances/${balanceId}`);
    expect(res.status).toBe(200);
    expect(res.body.balance.id).toBe("valid-balanceId");
    expect(res.body.balance.amount).toBeGreaterThanOrEqual(0);
    expect(new Date(res.body.balance.createdAt).getTime()).toBeLessThan(
      new Date().getTime()
    );
    done();
  });

  it("should response 404 Not Found", async done => {
    const balanceId = "nonexistent-balanceId";
    const res = await request(app).get(`/v1/balances/${balanceId}`);
    expect(res.status).toBe(404);
    done();
  });
});
