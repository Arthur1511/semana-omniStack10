const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
// index, show, update, destroy

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiRes = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = apiRes.data;

      console.log(name, avatar_url, bio, github_username);

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        bio,
        avatar_url,
        techs: techsArray,
        location
      });
    }

    return res.json(dev);
  },

  async update(req, res) {
    const {
      github_username,
      name,
      bio,
      avatar_url,
      techs,
      latitude,
      longitude
    } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      console.warn("Usuario nao existe na base de dados");
      return res.sendStatus(404);
    }

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    dev = await Dev.update({
      github_username,
      name,
      bio,
      avatar_url,
      techs: techsArray,
      latitude,
      longitude
    });

    return res.json(dev);
  },

  async destroy(req, res) {
    const { github_username } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      console.warn("Usuario nao existe na base de dados");
      return res.sendStatus(404);
    }

    await Dev.deleteOne({ github_username });

    return res.sendStatus(200);
  }
};
