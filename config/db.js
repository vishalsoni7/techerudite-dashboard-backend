const mongoose = require("mongoose");
const dotEnv = require("dotenv");

dotEnv.config({
  path: ".env",
});

const mongoURI = process.env.MONGODB;

const connectToDatabase = () => {
  if (!mongoURI) {
    console.error(`Environment variable not defined!`);
  }
  mongoose
    // .connect(mongoURI)
    // .then(() => console.log(`Connected to MongoDB`))
    // .catch((error) => console.error(`Error connecting to MongoDB: ${error}`));

    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
      console.error("Error connecting to MongoDB: ", error);
      if (error && error.cause) {
        console.error("Cause:", error.cause);
      }
    });
};

module.exports = connectToDatabase;
