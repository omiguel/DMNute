/**
 * Created by Osvaldo on 20/10/15.
 */

var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/situacao.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');
utility.inherits(SituacaoManager, Manager);

/**
 * @constructor
 */
function SituacaoManager(){
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};

    me.wiring();
}

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
SituacaoManager.prototype.executaCrud = function(msg){
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.')+1);
    console.log(method);
    try {
        me[method](msg);
    }catch (e){
        hub.emit('error.manager.situacao', e);
    }
};

/**
 * Faz a ligacao dos evendos que essa classe vai escutar, e liga as funcoes que serao executadas
 */
SituacaoManager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.situacao.*'] = me.executaCrud.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new SituacaoManager();