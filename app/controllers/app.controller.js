const App = require('../models/app.model');

const companiesController = {
  getAllApps: async (req, res) => {
    try {
      const apps = await App.find();
      res.json(apps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  findOne : (req, res) => {
    const id = req.params.id;
  
    App.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found App with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving App with id=" + id });
      });
  },
  

  createApp: async (req, res) => {
    try {
      const app = new App({
        name: req.body.name,
        website: req.body.website,
        companyId:req.body.companyId,

      });
      const savedApp = await app.save();
      res.json(savedApp);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  updateApp: async (req, res) => {
    try {
      const app = await App.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        website: req.body.website,
        companyId:req.body.companyId,

      }, { new: true });
      if (!app) {
        return res.status(404).json({ error: 'App not found' });
      }
      res.json(app);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  deleteApp: async (req, res) => {
    try {
      const app = await App.findByIdAndDelete(req.params.id);
      if (!app) {
        return res.status(404).json({ error: 'app not found' });
      }
      res.json({ message: 'app deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = companiesController;
