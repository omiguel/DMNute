/**
 * Created by Osvaldo on 20/10/15.
 */


var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/dispositivo.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');
utility.inherits(DispositivoManager, Manager);

function DispositivoManager(){
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
DispositivoManager.prototype.executaCrud = function(msg){
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.')+1);
    console.log(method, msg.getFlag());
    try {
        me[method](msg);
    }catch (e){
        hub.emit('error.manager.dispositivo', e);
    }
};

DispositivoManager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.dispositivo.*'] = me.executaCrud.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new DispositivoManager();