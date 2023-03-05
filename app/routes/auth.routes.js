const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");
const { verifyEmail } = require("../email.verification/email");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post(
    "/api/auth/signup/fraud-analyst",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      authJwt.verifyToken,authJwt.isOwner
    ],
    controller.signupfraudanalyst
  );

  app.post(
    "/api/auth/signup/supervisor",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      authJwt.verifyToken,authJwt.isAdmin
    ],
    controller.signupsupervisor
  );


  app.post("/api/auth/signin", controller.signin);

  app.get('/verify-email/:email',controller.verifyEmail);
  
  // app.post('/confirmation', Controller.confirmationPost);
  // app.post('/resend', Controller.resendTokenPost);

  app.post(
    "/forgot-password",
    // [
    //   check("email", "Please enter a valid email address").isEmail(),
    // ],
    controller.sendPasswordResetEmail
  );
  app.post(
    "/reset/:token",
    // [
    //   check("email", "Please enter a valid email address").isEmail(),
    // ],
    controller.resetPassword
  );








};