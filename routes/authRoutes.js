const express = require("express");
const dashboardRouter = express.Router();

const {
  userLogin,
  userRegister,
  getAllCustomers,
} = require("../controllers/authController");

dashboardRouter.use(express.json());

dashboardRouter.get("/all-customers", async (req, res) => {
  try {
    const allCustomers = await getAllCustomers();
    res.status(200).json(allCustomers);
  } catch (error) {
    res.status(500).json(`Could not fetch all customers: ${error}`);
  }
});

dashboardRouter.post("/register", async (req, res) => {
  try {
    const savedUser = await userRegister(req.body);

    if (savedUser) {
      res.status(200).json(savedUser);
    } else {
      res.status(401).json(`Please fill all details!`);
    }
  } catch (error) {
    res.status(500).json(`Could not register: ${error}`);
  }
});

dashboardRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userLogin(email, password);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json(`Invalid credentials!`);
    }
  } catch (error) {
    res.status(500).json(`Could not login: ${error}`);
  }
});

module.exports = dashboardRouter;
