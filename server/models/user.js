//USERS MODEL
//Aquí vamos a definir el modelo de datos de los usuarios

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let monedasPosibles = {
    values: ['EUR', 'USD', 'ARS'],
    message: '{VALUE} no es una moneda válida'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'El username es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    monedaPreferida: {
        type: String,
        enum: monedasPosibles,
        required: [true, 'La preferencia de la moneda es obligatoria']
    },
    criptomonedas: {
        type: [{
            type: String
        }],
        required: false
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
}
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);