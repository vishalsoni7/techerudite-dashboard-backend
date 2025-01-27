const SendVerificationMail = require("../config/email");
const UserSchema = require("../models/User");
const bcrypt = require("bcryptjs");

const getAllCustomers = async (page = 1, limit = 10) => {
  try {
    const customers = await UserSchema.find({
      role: "customer",
    })
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCustomers = await UserSchema.countDocuments({
      role: "customer",
    });

    const totalPages = Math.ceil(totalCustomers / limit);

    return {
      customers,
      totalCustomers,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error(`Error while getting all customers: ${error}`);
  }
};

const userLogin = async (email, password) => {
  if (!email || !password) {
    throw new Error(`Email and password are required`);
  }

  try {
    const user = await UserSchema.findOne({ email });

    if (!user) {
      throw new Error(`User not found`);
    }

    if (user.role === "customer") {
      throw new Error(`Admin login only`);
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    throw error;
  }
};

const userRegister = async (userDetails) => {
  const requiredFields = ["firstName", "lastName", "email", "password", "role"];
  const missingDetails = requiredFields.filter((field) => !userDetails[field]);

  if (missingDetails.length > 0) {
    console.error(
      `Missing required user details: ${missingDetails.join(", ")}`
    );
    return;
  }

  try {
    const existingUser = await UserSchema.findOne({ email: userDetails.email });

    if (existingUser) {
      throw new Error(`User with ${userDetails.email} email already exists`);
    }

    const hashPassword = await bcrypt.hashSync(userDetails.password, 10);

    const emailVerificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new UserSchema({
      ...userDetails,
      password: hashPassword,
      emailVerificationToken,
    });

    await newUser.save();
    SendVerificationMail(newUser.email, newUser.role, emailVerificationToken);

    return newUser;
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    throw error;
  }
};

const verifyEmail = async (token) => {
  try {
    const user = await UserSchema.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      throw new Error(`User not found`);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    return user;
  } catch (error) {
    console.error(`Email verification error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  userLogin,
  userRegister,
  getAllCustomers,
  verifyEmail,
};
