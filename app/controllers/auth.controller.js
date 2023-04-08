const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const nodemailer = require("nodemailer");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const sendEmail = require("../email.verification/email");
const crypto = require("crypto");





exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save()
    .then(user => {
      if (req.body.roles) {
        Role.find({
          name: { $in: req.body.roles }
        })
          .then(roles => {
            user.roles = roles.map(role => role._id);
            return user.save();
          })
          .then(() => {
            res.send({ message: "an email has been sent to you. please verify your email!" });
          })
          .catch(err => {
            res.status(500).send({ message: err });
          });
      } else {
        Role.find({ name: { $in: ["ecommerce-owner", "fraud-analyst"] } })
        .then(roles => {
          user.roles = roles.map(role => role._id);
          return user.save();
        })
          .then(() => {
       
            res.send({ message: "an email has been sent to you. please verify your email!" });

          })
          .catch(err => {
            res.status(500).send({ message: err });
          });
         sendEmail.sendVerificationEmail(user.email,req.headers.host);
      }
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
};


exports.verifyEmail = (req, res) => {
  const email = req.params.email;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      user.isVerified = true;
      return user.save();
    })
    .then(() => {
      res.send({ message: "Email verified successfully" });
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
};
exports.sendSignUpEmail = async (req, res, next) => {
  const email = req.body.email; // Get the email address from the request body
  const appId = req.params.appId; // Get the app ID from the request params

  try {
    await sendEmail.sendFraudAnalystSignUpEmail(email, req); // Send the email using the sendEmail method
    res.status(200).json({ message: 'Email sent successfully' }); // Send a success response to the client
  } catch (err) {
    console.error(err); // Log any errors
    res.status(500).json({ error: 'Email could not be sent' }); // Send an error response to the client
  }
};

exports.signupfraudanalyst = (req, res) => {
  const appId = req.params.appId;

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save()
    .then(user => {
      if (req.body.roles) {
        Role.find({
          name: { $in: req.body.roles }
        })
          .then(roles => {
            user.roles = roles.map(role => role._id);
            return user.save();
          })
          .then(() => {
            res.send({ message: "User was registered successfully!" });
          })
          .catch(err => {
            res.status(500).send({ message: err });
          });
      } else {
        Role.findOne({ name: "fraud-analyst" })
          .then(role => {
            user.roles = [role._id];
            user.apps = appId; // set the app ID
            return user.save();
          })
          .then(() => {
            res.send({ message: "User was registered successfully!" });
            sendEmail.sendVerificationEmail(user.email, req.headers.host);

          })
          .catch(err => {
            res.status(500).send({ message: err });
          });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
};









exports.signupsupervisor = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save()
    .then(user => {
      if (req.body.roles) {
        Role.find({
          name: { $in: req.body.roles }
        })
          .then(roles => {
            user.roles = roles.map(role => role._id);
            return user.save();
          })
          .then(() => {
            res.send({ message: "User was registered successfully!" });
          })
          .catch(err => {
            res.status(500).send({ message: err });
          });
      } else {
        Role.findOne({ name: "supervisor" })
          .then(role => {
            user.roles = [role._id];
            return user.save();
          })
          .then(() => {
            res.send({ message: "User was registered successfully!" });
          })
          .catch(err => {
            res.status(500).send({ message: err });
          });
          sendEmail.sendVerificationEmail(user.email,req.headers.host);

      }
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      if (!user.isVerified) return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' }); 


      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
};


exports.changepassword = async (req, res) => {
  const { oldpassword, newpassword } = req.body;

  if (!oldpassword || !newpassword) {
    return res
      .status(400)
      .send({ message: "Old password and new password are required!" });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    const isOldPasswordCorrect =bcrypt.compareSync(
      req.body.oldpassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(401).send({ message: "Invalid old password!" });
    }

    user.password = newpassword;
    await user.save();

    res.status(200).send({ message: "Password changed successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error changing password!" });
  }
};










exports.sendPasswordResetEmail = (req, res) => {
  let token; // Define token in a higher scope

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      token = crypto.randomBytes(20).toString("hex"); // Assign value to token

      user.passwordResetToken = token;
      user.passwordResetExpires = Date.now() + 3600000;

      return user.save();
    })
    .then(() => {
      sendEmail.sendPasswordEmail(req.body.email,req.headers.host,token)
      res.status(200).json({ message: 'Email sent succesfully.' });

    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};












exports.resetPassword = (req, res) => {
  User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() }
  }).then(user => {
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    user.password= bcrypt.hashSync(req.body.password, 8)
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return user.save();
  }).then(() => {
    res.status(200).json({ message: 'Password has been reset successfully.' });
  }).catch(err => {
    res.status(500).json({ message: err.message });
  });
};




exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).send({ message: "Logout successful!" });
}
