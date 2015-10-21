/**
 * Created by Osvaldo on 06/10/15.
 */
var Mongoosemodels = {
    usuario: require('./UsuarioManager.js'),
    mapa: require('./MapaManager.js'),
    modelodisp: require('./ModeloDispManager.js'),
    situacao: require('./SituacaoManager.js'),
    dispositvo: require('./DispositivoManager.js')
};

module.exports = Mongoosemodels;