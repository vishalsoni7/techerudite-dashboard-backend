const express = require("express");
const dashboardRouter = express.Router();

const {
  userLogin,
  userRegister,
  getAllCustomers,
  verifyEmail,
} = require("../controllers/authController");

dashboardRouter.use(express.json());

dashboardRouter.get(`/all-customers`, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const allCustomers = await getAllCustomers(Number(page), Number(limit));
    res.status(200).json(allCustomers);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Could not fetch all customers: ${error}` });
  }
});

dashboardRouter.post(`/register`, async (req, res) => {
  try {
    const savedUser = await userRegister(req.body);

    if (savedUser) {
      res.status(200).json({
        message: `${savedUser.role} registered successfully`,
        newUser: savedUser,
      });
    } else {
      res.status(401).json({ message: `Please fill all details!` });
    }
  } catch (error) {
    res.status(500).json({ message: `Could not register`, error });
  }
});

dashboardRouter.post(`/login`, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userLogin(email, password);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json(`Invalid credentials!`);
    }
  } catch (error) {
    res.status(500).json({ message: `Could not login`, error });
  }
});

dashboardRouter.post(`/verify-email`, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await verifyEmail(token);

    if (user) {
      res.status(200).json({ message: `Email verified successfully`, user });
    } else {
      res.status(401).json({ message: `Invalid token!` });
    }
  } catch (error) {
    res.status(500).json({ message: `Could not verified`, error });
  }
});

module.exports = dashboardRouter;
