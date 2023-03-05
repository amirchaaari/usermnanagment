exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("Owner Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  exports.adminBoard = (req, res) => {
    res.status(200).send("Fraud-analyst Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("supervisor Content.");
  };



  
  