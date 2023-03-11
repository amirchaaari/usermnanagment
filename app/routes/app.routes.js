const express = require('express');
const appController = require('../controllers/app.controller');


const { authJwt } = require("../middlewares");



module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
// Define routes for CRUD operations on app
app.get('/api/apps', [authJwt.verifyToken], appController.getAllApps);
app.get('/api/app/:id',[authJwt.verifyToken], appController.findOne);
app.post('/api/addapp',[authJwt.verifyToken], appController.createApp);
app.put('/api/updateapp/:id',[authJwt.verifyToken], appController.updateApp);
app.delete('/api/deleteapp/:id',[authJwt.verifyToken], appController.deleteApp);



}