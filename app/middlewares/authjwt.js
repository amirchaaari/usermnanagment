const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    const roles = await Role.find({ _id: { $in: user.roles } }).exec();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Require Admin Role!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


isSupervisor = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    const roles = await Role.find({ _id: { $in: user.roles } }).exec();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "Supervisor") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Require Supervisor Role!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

isOwner = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    const roles = await Role.find({ _id: { $in: user.roles } }).exec();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "ecommerce-owner") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Require e-commerce owners Role!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


const authJwt = {
  verifyToken,
  isAdmin,
  isSupervisor,
  isOwner
};
module.exports = authJwt;