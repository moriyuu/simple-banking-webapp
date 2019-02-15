import express from "express";
import bodyParser from "body-parser";
import * as balanceController from "./controllers/balance";
import * as depositController from "./controllers/deposit";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/v1/balances", balanceController.createBalance);
app.get("/v1/balances/:balanceId", balanceController.showBalance);
app.post("/v1/deposits", depositController.createDeposit);
app.get("/v1/deposits", depositController.listDeposits);
app.get("/v1/deposits/:depositId", depositController.showDeposit);

export default app;
