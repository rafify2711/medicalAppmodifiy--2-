import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;

// import nodemailer from "nodemailer";

// export const sendEmail = async()=>{
    // const transporter = nodemailer.createTransport({
// service:'gmail',
//   auth: {
//     user: "hhgg18353@gmail.com",
//     pass: "macqmdpokfapqgva",
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport obj[[[[[[[[[[[[[[[[[[[ect
//   const info = await transporter.sendMail({
//     from: '"shrouk" <hhgg18353@gmail.com>', // sender address
//     to: "maddison53@ethereal.email", // list of receivers
//     subject: "Test 3ady", // Subject line
//     text: "helloo", // plain text body
//     // html: "<b>Hello world?</b>", // html body/
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);
//retuen info
// }