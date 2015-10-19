/**
 * Created by Osvaldo on 06/10/15.
 */

var Mongoose = require('../Banco.js').mongoose;

var types = Mongoose.Schema.Types;

var options = {
    toJSON: {
        getters: true
    },
    toObject: {
        getters: true
    }
};

var usuario = Mongoose.Schema({
    login: types.String,
    senha: types.String,
    tipo: types.Number
});

module.exports = Mongoose.model('usuario', usuario);