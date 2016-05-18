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
    situacao: {type: types.ObjectId, ref: 'situacao'},
    modelo: {type: types.ObjectId, ref: 'modelodisp'},
    mapa: {type: types.ObjectId, ref: 'mapa'},
    x: {type: types.Number},
    y: {type: types.Number}
});

module.exports = Mongoose.model('dispositivo', dispositivo);