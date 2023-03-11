const platformController = require('../controllers/platform.controller');


const { authJwt } = require("../middlewares");



module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
// Define routes for CRUD operations on companies
app.get('/api/platforms', [authJwt.verifyToken,authJwt.isOwner], platformController.getAllPlatftforms);
app.get('/api/platform/:id',[authJwt.verifyToken,authJwt.isOwner], platformController.findOne);
app.post('/api/addplatform',[authJwt.verifyToken,authJwt.isOwner], platformController.createPlatform);
app.put('/api/updateplatform/:id',[authJwt.verifyToken,authJwt.isOwner], platformController.updatePlatform);
app.delete('/api/deleteplatform/:id',[authJwt.verifyToken,authJwt.isOwner], platformController.deletePlatform);

}