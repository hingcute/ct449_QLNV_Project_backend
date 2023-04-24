const express = require("express");
const todos = require("../controllers/todo.controller");

const router = express.Router();

router.route("/")
    .get(todos.findAll)
    .post(todos.create)
    .delete(todos.deleteAll)

router.route("/favoritee")
    .get(todos.findAllFavorite);

router.route("/:id")
    .get(todos.findOne)
    .put(todos.update)
    .delete(todos.delete)

module.exports = router;