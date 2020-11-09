//SIGNUP
//Aquí definiremos las rutas para la creación de usuarios

const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const app = express();

app.post('/signup', function (req, res) {
    try {
        if (!req.body.nombre) {
            res.status(400).json({
                ok: false,
                message: 'Nombre Body Param es obligatorio',
                status: 400
            });
        } else if (!req.body.apellido) {
            res.status(400).json({
                ok: false,
                message: 'Apellido Body Param es obligatorio',
                status: 400
            });
        } else if (!req.body.username) {
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
        } else if (!req.body.coin) {
            res.status(400).json({
                ok: false,
                message: 'Coin Body Param es obligatorio',
                status: 400
            });
        } else {
            let body = req.body;
            let regexalfanumerica = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/i;

            if (!(body.password.length >= 8)) {
                res.status(400).json({
                    ok: false,
                    message: 'La contraseña debe tener un mínimo de 8 caracteres',
                    status: 400
                });
            }

            if (!(body.password.match(regexalfanumerica))) {
                res.status(400).json({
                    ok: false,
                    message: 'La contraseña debe ser alfanumérica',
                    status: 400
                });
            }

            let user = new User({
                nombre: body.nombre,
                apellido: body.apellido,
                username: body.username,
                password: bcrypt.hashSync(body.password, 10),
                monedaPreferida: body.coin
            });

            user.save((err, userDB) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        message: err.message,
                        status: 500
                    });
                }

                res.status(201);
                res.json({
                    ok: true,
                    message: 'Se ha creado el usuario en la base de datos',
                    user: userDB,
                    status: 201
                });
            })
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = app;