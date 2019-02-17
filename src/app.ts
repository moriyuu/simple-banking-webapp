import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import * as balanceController from "./controllers/balance";
import * as depositController from "./controllers/deposit";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/v1/balances", balanceController.createBalance);
app.get("/v1/balances/:balanceId", balanceController.showBalance);
app.post("/v1/deposits", depositController.createDeposit);
app.get("/v1/deposits", depositController.listDeposits);
app.get("/v1/deposits/:depositId", depositController.showDeposit);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!(err.status && err.code)) {
    err = { status: 500, code: "Internal server error" };
  }
  res.status(err.status).json({ status: err.status, code: err.code });
});

export default app;
