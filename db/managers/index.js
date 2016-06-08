/**
 * Created by Osvaldo on 06/10/15.
 */

/**
 * variavel que contem e inicializa todos os managers dos models do banco.
 *
 * @type {{usuario: UsuarioManager, mapa: MapaManager, modelodisp: ModeloDispManager, situacao: SituacaoManager, dispositvo: DispositivoManager}}
 */
var Mongoosemodels = {
    usuario: require('./UsuarioManager.js'),
    mapa: require('./MapaManager.js'),
    modelodisp: require('./ModeloDispManager.js'),
    situacao: require('./SituacaoManager.js'),
    dispositvo: require('./DispositivoManager.js')
};

module.exports = Mongoosemodels;