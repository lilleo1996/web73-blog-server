const express = require("express");

const usersController = require("../controllers/usersController");

const usersRouter = express.Router();

// REGISTER
usersRouter.post("/register", usersController.register);

// REGISTER
usersRouter.post("/login", usersController.login);

module.exports = usersRouter;
