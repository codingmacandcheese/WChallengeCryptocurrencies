//LOGIN ROUTES
//Aqui definiremos las rutas para el autenticación mediante JWT

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var cors = require('cors');

const User = require('../models/user');
const config = require('../config/config');

const app = express();

app.use(cors());

app.post('/login', (req, res) => {
    try {
        if (!req.body.username) {
            res.status(400).json({
                ok: false,
                message: 'Username Body Param es obligatorio',
                status: 400
            });
        } else if (!req.body.password) {
            res.status(400).json({
                ok: false,
                message: 'Password Body Param es obligatorio',
                status: 400
            });
        } else {
            let body = req.body;

            User.findOne({ username: (body.username).toLowerCase() }, (err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err.message,
                        status: 500
                    });
                }
                if (!userDB) {
                    return res.status(400).json({
                        ok: false,
                        err: 'No se ha encontrado ningun usuario con ese username',
                        status: 400
                    });
                }
                if (!bcrypt.compareSync(body.password, userDB.password)) {
                    return res.status(400).json({
                        ok: false,
                        err: 'El password es incorrecto',
                        status: 400
                    })
                }

                let token = jwt.sign({
                    usuario: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.status(200).json({
                    ok: true,
                    usuario: userDB,
                    token: token,
                    status: 200
                });
            })
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = app;