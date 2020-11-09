//SERVER 
//Aquí se configurará el server

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//----------------------------------
//  Configuración Global de Rutas
//----------------------------------

app.use(require('./server/routes/index'));

//----------------------
//  Conexión a la BDD
//----------------------

mongoose.connect('mongodb+srv://admin:123456.a@cluster0-l7zwq.mongodb.net/wchallengecryptocurrencies', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err, res) => {
    if (err) {
        throw err;
    }

    console.log('Base de datos ONLINE');
});

//----------------------
//  PING a COINGECKO
//----------------------

const coingecko = async () => {
    try {
        await axios.get('https://api.coingecko.com/api/v3/ping')
            .then(response => {
                if(response.status == 200) {
                    console.log('Coingecko API OK');
                } else {
                    console.log('Houston, we have a problem. API is not OK')
                }
            })
    } catch (error) {
        console.log('Houston, we have a problem.')
        console.error(error)
    }
}

coingecko();

//-------------------------
//  Swagger UI
//------------------------- 

swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//-------------------------
//  Conexión al servidor
//------------------------- 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Escuchando al puerto: ', PORT);
})