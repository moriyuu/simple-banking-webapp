import express from "express";
import bodyParser from "body-parser";
import * as balanceController from "./controllers/balance";
import * as depositController from "./controllers/deposit";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/balances", balanceController.createBalance);
app.get("/balances/:balanceId", balanceController.showBalance);
app.post("/deposits", depositController.createDeposit);
app.get("/deposits", depositController.listDeposits);
app.get("/deposits/:depositId", depositController.showDeposit);

app.listen(3000);
