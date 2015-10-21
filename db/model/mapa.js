/**
 * Created by Osvaldo on 20/10/15.
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

var mapa = Mongoose.Schema({
    nome: {type: types.String, required: true},
    img: {type: types.String, required: true}
});

module.exports = Mongoose.model('mapa', mapa);