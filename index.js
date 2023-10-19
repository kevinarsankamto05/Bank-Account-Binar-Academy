const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const router = require("./src/routers/index");
const bankAccount = require("./src/routers/bankAccount");
const transaction = require("./src/routers/transaction");

const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("./documentationApi.json");

app.use(express.json({ strict: false }));
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use("/api/v1", router);
app.use("/api/v1", bankAccount);
app.use("/api/v1", transaction);

app.listen(PORT, () => {
  console.log(`Server is runing at PORT ${PORT}`);
});
