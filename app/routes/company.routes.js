const express = require('express');
const companiesController = require('../controllers/company.controller');


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
app.get('/api/companies', [authJwt.verifyToken,authJwt.isOwner], companiesController.getAllCompanies);
app.get('/api/company/:id',[authJwt.verifyToken,authJwt.isOwner], companiesController.findOne);
app.post('/api/addcompany',[authJwt.verifyToken,authJwt.isOwner], companiesController.createCompany);
app.put('/api/updatecompany/:id',[authJwt.verifyToken,authJwt.isOwner], companiesController.updateCompany);
app.delete('/api/deletecompany/:id',[authJwt.verifyToken,authJwt.isOwner], companiesController.deleteCompany);

}