const App = require('../models/app.model');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const Platform = require('../models/platform.model');



const appController = {
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

  
 createApp : async (req, res) => {
    try {
      const app = new App({
        name: req.body.name,
        website: req.body.website,
        companyId: req.body.companyId
      });
      const savedApp = await app.save();
  
      // Update the user's apps array with the new app ID
      const userId = req.userId;
      const user = await User.findById(userId);
      user.apps.push(savedApp._id);
      await user.save();

      const updatedCompany = await Company.findOneAndUpdate(
        { _id: req.body.companyId },
        { $push: { apps: savedApp._id } },
        { new: true }
      );
  
    res.json({ app: savedApp, company: updatedCompany });
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
      const app = await App.findById(req.params.id);
  
      if (!app) {
        return res.status(404).json({ error: 'App not found' });
      }
  
      // Delete all platforms associated with the app
      await Platform.deleteMany({ appId: app._id });
  
      // Remove the app from all users
      await User.updateMany(
        { apps: app._id },
        { $pull: { apps: app._id } }
      );
  
      // Remove the app from its company
      await Company.updateOne(
        { apps: app._id },
        { $pull: { apps: app._id } }
      );
  
      // Delete the app
      await app.delete();
  
      res.json({ message: 'App deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
  

}  

module.exports = appController;
