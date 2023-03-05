const Company = require('../models/company.model');

const companiesController = {
  getAllCompanies: async (req, res) => {
    try {
      const companies = await Company.find();
      res.json(companies);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  findOne : (req, res) => {
    const id = req.params.id;
  
    Company.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found App with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Aap with id=" + id });
      });
  },
  

  createCompany: async (req, res) => {
    try {
      const company = new Company({
        name: req.body.name,
        website: req.body.website,
        service:req.body.service
      });
      const savedCompany = await company.save();
      res.json(savedCompany);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  updateCompany: async (req, res) => {
    try {
      const company = await Company.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        website: req.body.website,
        service:req.body.service

      }, { new: true });
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      res.json(company);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  deleteCompany: async (req, res) => {
    try {
      const company = await Company.findByIdAndDelete(req.params.id);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      res.json({ message: 'Company deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = companiesController;
