//CRYPTOCURRENCIES ROUTES
//Aquí definiremos las rutas para las criptomonedas

const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const config = require('../config/config');

const verificaToken = require('../auth/authorization');

var router = express.Router();

router.use(verificaToken);

router.get('/get', async (req, res) => {
    try {
        let decodedToken = jwt.verify(req.headers.token, process.env.SEED);

        await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=' + decodedToken.usuario.monedaPreferida + '&order=market_cap_desc&per_page=100&page=1&sparkline=false')
            .then(response => {
                if (response.status == 200) {
                    let cryptocurrencies = new Array();

                    for (let i = 0; i < response.data.length; i++) {
                        const moneda = response.data[i];
                        let cryptocurrency = new Object();

                        cryptocurrency.simbolo = moneda.symbol;
                        cryptocurrency.precio = moneda.current_price;
                        cryptocurrency.nombre = moneda.name;
                        cryptocurrency.imagen = moneda.image;
                        cryptocurrency.ultimaActualizacion = moneda.last_updated;

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
    } catch (error) {
        res.send(error);
    }
})

module.exports = router;