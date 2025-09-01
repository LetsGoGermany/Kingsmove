
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // Alternativ: "Outlook", "Yahoo", etc.
  auth: {
    user: "royal.chess.service@gmail.com", // Deine E-Mail-Adresse
    pass: "rubb idru dwgb ljzh", // Dein E-Mail-Passwort oder App-Passwort
  },
  tls: {
    rejectUnauthorized: false
  }
});


const sendVerificationCode = async (emailAdress,verification) => {

  const mailOptions = {
    from: "royal.chess.service@gmail.com", // Absender
    to: emailAdress, // Empfänger
    subject: "Royal Chess Verifizierungscode", // Betreff
    html: `
       <div style="width: 100%;height: 500px;background: none; text-align: center;">
        <button style='
            border: none;
            background-color: #FFA500;
            box-shadow: 5px 5px 10px #DD8300;
            box-shadow: 10%;
            margin-top: 160px;
            width: 240px;
            height: 90px;
            border-radius: 0.4rem;
            font-size: 50px;
            color: #FFFFFF;
            font-family: "Times New Roman", Times, serif;
            font-weight: bold;
            letter-spacing: 7px
            '>${verification}</button>
   </div>
    `
  };



  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-Mail gesendet: ", info.response + verification);
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail: " + error);
  }
};

module.exports = {sendVerificationCode}