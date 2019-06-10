const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

router.get("/test", (req, res) => res.json({ msg: "User works" }));

// Retreive Profile
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "there is no profile";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//Create Profile
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profilefields = {};
    profilefields.user = req.user.id;
    if (req.body.handle) profilefields.handle = req.body.handle;
    if (req.body.company) profilefields.company = req.body.company;
    if (req.body.website) profilefields.website = req.body.website;
    if (req.body.location) profilefields.location = req.body.location;
    if (req.body.bio) profilefields.bio = req.body.bio;
    if (req.body.status) profilefields.status = req.body.status;
    if (req.body.githubusername)
      profilefields.githubusername = req.body.githubusername;

    if (typeof req.body.skills !== "undefined") {
      profilefields.skills = req.body.skills.split(",");
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profilefields },
          { new: true }
        ).then(profile => {
          res.json(profile);
        });
      } else {
        //Create
        Profile.findOne({ handle: profilefields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          new Profile(profilefields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);
module.exports = router;
