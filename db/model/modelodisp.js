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

var modelodisp = Mongoose.Schema({
    tipodisp: {type: types.String, required: true},
    marca: {type: types.String, required: true},
    modelo: {type: types.String, required: true},
    apresentacao: {type: types.String, required: true}
});

module.exports = Mongoose.model('modelodisp', modelodisp);