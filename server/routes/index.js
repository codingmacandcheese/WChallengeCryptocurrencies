//ROUTE INDEX
//Aqí se definen todas las rutas de School Dashboard

const express = require('express');

let users = require('./user');
let cryptocurrencies = require('./cryptocurrency');

const app = express();

app.use(require('./login'));
app.use(require('./signup'));
app.use('/user', users);
app.use('/cryptocurrency', cryptocurrencies);

module.exports = app;