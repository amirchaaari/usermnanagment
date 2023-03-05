const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const authcontroller = require("../controllers/auth.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/owner", [authJwt.verifyToken,authJwt.isOwner], controller.userBoard);
  

  app.get(
    "/api/test/sup",
    [authJwt.verifyToken, authJwt.isSupervisor],
    controller.moderatorBoard
  );
  app.get(
    "/api/test/fraud-analyst",
    [authJwt.verifyToken],
    controller.moderatorBoard
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.post("/api/changepassword",[authJwt.verifyToken], authcontroller.changepassword);

};




