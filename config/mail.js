const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "devmazaharul@gmail.com",
    pass: "omur tlha djgz ldcu",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function mailSend(mail="",name="Dear",code) {

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <devmazaharul@gmail.com>', // sender address
    to: mail, // list of receivers
    subject: "Acctivation code ✔", // Subject line
    html: `<b>Hlw ${name}</b> <br/> <p>Your email is ${mail} . Your activaton code is ${code}</p>`, // html body
  });
}

export {
  mailSend
}
