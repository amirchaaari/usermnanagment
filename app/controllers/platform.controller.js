const Platform = require('../models/platform.model');
const App = require('../models/app.model');


const platformController = {
  getAllPlatftforms: async (req, res) => {
    try {
      const platforms = await Platform.find();
      res.json(platforms);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  findOne : (req, res) => {
    const id = req.params.id;
  
    Platform.findById(id)
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
  

  createPlatform: async (req, res) => {
    try {
      const platform = new Platform({
        platformType: req.body.platformType,
        apikey: req.body.apikey,
        appId:req.body.appId
      });
      const savedPlatform = await platform.save();
      const updatedApp = await App.findByIdAndUpdate(
        req.body.appId,
        { $push: { platforms: savedPlatform._id } },
        { new: true }
      );
      
      if (!updatedApp) {
        await Platform.findByIdAndDelete(savedPlatform._id);
        return res.status(404).json({ error: 'App not found' });
      }
      res.json(savedPlatform);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  updatePlatform: async (req, res) => {
    try {
      const platform = await Platform.findByIdAndUpdate(req.params.id, {
        platformType: req.body.platformType,
        apikey: req.body.apikey,
        appId:req.body.appId

      }, { new: true });
      if (!platform) {
        return res.status(404).json({ error: 'Platform not found' });
      }
      res.json(platform);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  deletePlatform: async (req, res) => {
    try {
      const platform = await Platform.findByIdAndDelete(req.params.id);
      if (!platform) {
        return res.status(404).json({ error: 'Platform not found' });
      }
      const app = await App.findByIdAndUpdate(
        platform.appId,
        { $pull: { platforms: platform._id } },
        { new: true }
      );
  
      res.json({ message: 'Platform deleted', updatedApp: app });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Platform error' });
    }
  }
};

module.exports = platformController;
