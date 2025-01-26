const UserSchema = require("../models/User");

const getAllCustomers = async () => {
  try {
    const customers = await UserSchema.find({
      role: "customer",
    }).select("-password");

    return customers;
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

    const newUser = new UserSchema(userDetails);
    await newUser.save();

    const { password, ...userResponse } = newUser.toObject();

    return userResponse;
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  userLogin,
  userRegister,
  getAllCustomers,
};
