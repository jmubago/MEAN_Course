'use strict'

var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();

api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);

module.exports = api;