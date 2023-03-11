const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use SSL,
                auth: {
    user: "nabil.meejri@gmail.com",
    pass: "qakunblobhyfksly"
  },
  requireTLS:true,
tls: {
rejectUnauthorized: false
}
  
});




exports.sendVerificationEmail = async (email,req) => {


  const mailOptions = {
    from: "fraud.detection@gmail.com",
    to: email,
    subject: "Please verify your email",
    text: "Thank you for signing up! Please click on the following link to verify your email address:",
    html: `<p>Thank you for signing up!</p><p>Please click on the following link to verify your email address:</p><a href="http://${req}/verify-email/${email}">Verify Email</a>`
  };

  await transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error sending email" });
    } else {
      console.log("Email sent");
    }
  });};
  
  

  exports.sendPasswordEmail=async(email,req,token)=>{
  const mailOptions = {
    to: email,
    from: "nabil.meejri@gmail.com",
    subject: "Reset your password",
    text: `You are receiving this email because you (or someone else) has requested to reset the password for your account. Please click on the following link, or paste this into your browser to complete the process:\n\n
    http://${req}/reset/${token}\n\n // Use token here
    If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  await transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error sending email" });
    } else {
      console.log("Email sent");
    }
  });


  exports.sendFraudAnalystSignUpEmail = async (email, req) => {
    const mailOptions = {
      to: email,
      from: "nabil.meejri@gmail.com",
      subject: "Sign up as a Fraud Analyst",
      text: `You are receiving this email because you have been invited to sign up as a Fraud Analyst on our platform. Please click on the following link, or paste this into your browser to complete the sign up process:\n\n
      http://${req.headers.host}/api/auth/signup/fraud-analyst?appId=${req.params.appId}\n\n // Use app ID here
      If you did not request this, please ignore this email.\n`
    };
  
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Email sent: " + info.response);
    });
  };
  




  
}
 
  


