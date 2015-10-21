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

var dispositivo = Mongoose.Schema({
    identificador: {type: types.String, required: true},
    serialnumber: {type: types.String, required: true},
    caminhoimg: {type: types.String, required: true},
    nome: {type: types.String, required: true},
    situacao: {type: types.ObjectId, ref: 'situacao'},
    modelo: {type: types.ObjectId, ref: 'modelodisp', required: true},
    mapa: {type: types.ObjectId, ref: 'mapa', required: true}
});

module.exports = Mongoose.model('dispositivo', dispositivo);