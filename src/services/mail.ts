import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const handleEmailError = async (error: any, msg: any) => {
  if (error.responseCode === 454) {
    console.error("Too many login attempts, retrying after delay...");
    await delay(60000); // Delay for 1 minute
    try {
      await transporter.sendMail(msg);
      console.log("Email sent successfully after retry");
    } catch (retryError) {
      console.error("Failed to send email after retry: ", retryError);
    }
  } else {
    console.error("Failed to send email: ", error);
  }
};

const emailWithNodemailer = async ({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}) => {
  const mailOptions = {
    from: process.env.SMTP_USERNAME, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent %s", info.response);
  } catch (error) {
    await handleEmailError(error, mailOptions);
  }
};


export function sentOtpByEmail(email: string, otp: string) {
  const subject = "OTP Verification";
  const html = `<p>Your OTP for verification is <strong>${otp}</strong></p>`;
  return emailWithNodemailer({ email, subject, html });
}