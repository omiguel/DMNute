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

var situacao = Mongoose.Schema({
    nome: {type: types.String, required: true},
    descricao: {type: types.String}
});

module.exports = Mongoose.model('situacao', situacao);