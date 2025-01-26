const express = require("express");
const app = express();
const cors = require("cors");
const connectToDatabase = require("./config/db");
const dashboardRouter = require("./routes/authRoutes");

const PORT = process.env.PORT;

connectToDatabase();

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (_, res) => {
  res.send("Techerudite Dashboard Backend");
});

app.use("/", dashboardRouter);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
