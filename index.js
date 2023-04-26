const express = require("express");
const { Op } = require("sequelize");
const app = express();
const { Joke } = require("./db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/jokes", async (req, res, next) => {
  try {
    const { content, tags } = req.query;
    const where = {
      ...(tags && { tags: { [Op.like]: `%${tags}%` } }),
      ...(content && { joke: { [Op.like]: `%${content}%` } }),
    };
    const jokes = await Joke.findAll({ where });
    res.status(200).send(jokes);
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// add POST route to /jokes that will create a new joke with a "joke" and "tags" field from request body
app.post("/jokes", async (req, res, next) => {
  try {
    const joke = await Joke.create({
      joke: req.body.joke,
      tags: req.body.tags,
    });
    res.status(201).send(joke);
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// add DELETE route to /jokes/:id that will delete a joke with the given id
app.delete("/jokes/:id", async (req, res, next) => {
  try {
    const joke = await Joke.findByPk(req.params.id);
    await joke.destroy();
    res.status(204).send();
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// add PUT route to /jokes/:id that will update a joke for a given id, with a "joke" and "tags" field from request body
app.put("/jokes/:id", async (req, res, next) => {
  try {
    const { joke, tags } = req.body;
    const oldJoke = await Joke.findByPk(req.params.id);
    await oldJoke.update({
      ...(joke && { joke: joke }),
      ...(tags && { tags: tags }),
    });
    res.status(200).send("updated");
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
