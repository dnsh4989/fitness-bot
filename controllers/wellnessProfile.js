const client = require("../config/client");
const WellnessProfile = require("../models/wellProfile");

exports.postAddProfile = (req, res, next) => {
  const username = req.body.username;

  client.v2
    .userByUsername(username)
    .then((user) => {
      console.log(user);
      if (user.data && user.data.username === username) {
        const name = user.data.name;
        const username = user.data.username;
        const id = user.data.id;
        const wellnessprofile = new WellnessProfile(id, name, username);
        wellnessprofile.save();
        console.log(req.body);
        res.send("Wellness Profile added.");
      } else {
        res.send("No wellness profile found.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProfiles = (req, res, next) => {
  WellnessProfile.fetchAll(req, res, next);
};

exports.getProfileDetailsById = (req, res, next) => {
  console.log(req.params.username);
  WellnessProfile.findById(req, res, next);
};

exports.updateProfileDetailsById = (req, res, next) => {
  console.log(req.body);
  const id = req.body.id;
  const name = req.body.name;
  const username = req.body.username;
  const _id = req.body._id;
  const wellnessprofile = new WellnessProfile(id, name, username, _id);
  wellnessprofile.save();
  res.send("Wellness Profile updated.");
};

exports.deleteProfileById = (req, res, next) => {
  console.log(req.params.id);
  WellnessProfile.deleteById(req, res, next);
};
