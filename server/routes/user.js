//USER ROUTES
//Aquí definiremos las rutas para los usuarios

const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/config');

const verificaToken = require('../auth/authorization');

var router = express.Router();

router.use(verificaToken);

router.put('/addCryptocurrency', async (req, res) => {
    try {
        if (!req.query.cryptocurrency) {
            return res.status(400).json({
                ok: false,
                message: 'Cryptocurrency Query Param es obligatorio',
                status: 400
            })
        } else {
            let cryptocurrency = req.query.cryptocurrency;
            let decodedToken = jwt.verify(req.headers.token, process.env.SEED);
            let flag = false;

            await axios.get('https://api.coingecko.com/api/v3/coins/list')
                .then(response => {
                    if (response.status == 200) {
                        for (let i = 0; i < response.data.length; i++) {
                            const moneda = response.data[i];

                            if (cryptocurrency.toLowerCase() == moneda.name.toLowerCase()) {
                                flag = true;
                                break;
                            }
                        }

                    } else {
                        return res.status(response.status).json({
                            ok: false,
                            message: response.statusText,
                            status: response.status
                        });
                    }
                })

            if (flag == false) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se ha encontrado ninguna criptomoneda con el nombre especificado para agregar al usuario',
                    status: 400
                })
            } else {
                User.findById(decodedToken.usuario._id, (err, userDB) => {
                    if (err) {
                        res.status(400).json({
                            ok: false,
                            err: err
                        });
                    }

                    if (!userDB) {
                        return res.status(400).json({
                            ok: false,
                            message: 'No se ha encontrado ningún usuario con el ID especificado',
                            status: 400
                        })
                    }

                    if (userDB.criptomonedas.find(element => element == cryptocurrency.toLowerCase())) {
                        return res.status(400).json({
                            ok: false,
                            message: 'El usuario ya posee la criptomoneda especificada',
                            status: 400
                        })
                    } else {
                        userDB.criptomonedas.push(cryptocurrency.toLowerCase());
                        userDB.save();

                        res.json({
                            ok: true,
                            message: 'Se ha agregado la criptomoneda al usuario',
                            status: 200
                        })
                    }
                })
            }
        }
    } catch (error) {
        res.send(error);
    }
})

router.get('/topCryptocurrencies', async (req, res) => {
    try {
        if (!req.query.n) {
            return res.status(400).json({
                ok: false,
                message: 'N Query Param es obligatorio',
                status: 400
            })
        } else {
            let n = req.query.n;
            let decodedToken = jwt.verify(req.headers.token, process.env.SEED);
            let order;
            
            if (isNaN(n) == true) {
                return res.status(400).json({
                    ok: false,
                    message: 'N Query Param debe ser un valor numérico',
                    status: 400
                })
            }

            if (n > 25) {
                return res.status(400).json({
                    ok: false,
                    message: 'N Query Param debe ser menor o igual a 25',
                    status: 400
                })
            }

            if (!req.query.order || req.query.order.toLowerCase() == 'descendente') {
                order = 'market_cap_desc';
            } else if (req.query.order.toLowerCase() == 'ascendente') {
                order = 'market_cap_asc';
            } else {
                return res.status(400).json({
                    ok: false,
                    message: 'Envie un tipo de orden válido',
                    status: 400
                })
            }
            await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=' + decodedToken.usuario.monedaPreferida + '&order=' + order + '&per_page=' + n + '&page=1&sparkline=false')
                .then(async response => {
                    if (response.status == 200) {
                        let cryptocurrencies = new Array();

                        for (let i = 0; i < response.data.length; i++) {
                            const moneda = response.data[i];
                            let cryptocurrency = new Object();

                            cryptocurrency.simbolo = moneda.symbol;
                            cryptocurrency.nombre = moneda.name;
                            cryptocurrency.imagen = moneda.image;
                            cryptocurrency.ultimaActualizacion = moneda.last_updated;

                            await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=' + moneda.id + '&vs_currencies=usd%2Ceur%2Cars')
                                .then(response => {
                                    if (response.status == 200) {
                                        cryptocurrency.precioARS = response.data[moneda.id].ars;
                                        cryptocurrency.precioUSD = response.data[moneda.id].usd;
                                        cryptocurrency.precioEUR = response.data[moneda.id].eur;

                                    } else {
                                        return res.status(response.status).json({
                                            ok: false,
                                            message: response.statusText,
                                            status: response.status
                                        });
                                    }
                                })

                            cryptocurrencies.push(cryptocurrency);
                        }

                        return res.status(200).json({
                            ok: true,
                            criptomonedas: cryptocurrencies,
                            status: 200
                        });
                    } else {
                        return res.status(response.status).json({
                            ok: false,
                            message: response.statusText,
                            status: response.status
                        });
                    }
                })
        }
    } catch (error) {
        res.send(error);
    }
})

module.exports = router;