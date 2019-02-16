import request from "supertest";
import app from "../app";

describe("POST /v1/deposits", () => {
  it("should response 200 OK", async done => {
    const res = await request(app)
      .post("/v1/deposits")
      .send({ balanceId: "foobar", amount: 25000 });
    expect(res.status).toBe(200);
    expect(res.body.deposit.id).not.toBeUndefined();
    expect(res.body.deposit.balanceId).toBe("foobar");
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

// TODO: Define deposit in db
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
