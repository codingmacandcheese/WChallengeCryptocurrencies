const jwt = require('jsonwebtoken');

const config = require('../config/config');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                message: err.message,
                status: 401
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = verificaToken;