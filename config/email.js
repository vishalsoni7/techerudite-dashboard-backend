const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "vishsoni043@gmail.com",
    pass: "gbdgbzshzjimwakq",
  },
});

const SendVerificationMail = async (email, subject, emailVerificationToken) => {
  if (!process.env.FRONTEND_URL) return;

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;

  try {
    const res = await transporter.sendMail({
      from: '"Techerudite" <vishsoni043@gmail.com>',
      to: email,
      subject: `${subject} verification email`,
      html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
    });

    return res;
  } catch (error) {
    console.error(error);
  }
};

module.exports = SendVerificationMail;
