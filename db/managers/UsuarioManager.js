
var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/usuario.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');

function UsuarioManager(){
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};

    me.wiring();
}

utility.inherits(UsuarioManager, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
UsuarioManager.prototype.executaCrud = function(msg){
    var me = this;
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.')+1);
    console.log('estou executando isso', method);
    try {
        me[method](msg);
    }catch (e){
        me.emitManager(msg, 'error.manager', {err: e});
    }
};

UsuarioManager.prototype.trataLogin = function(msg){
    var me = this;
    var dado = msg.getRes();
    var msgRet = null;

    this.model.findOne({'login': dado.login, 'senha': dado.senha}, function(err, res){
        if(res){
            me.emitManager(msg, '.login', {res: res});
        } else if(err){
            me.emitManager(msg, '.error.logar', {err: err});
        } else{
            me.emitManager(msg, '.invaliduser', {res: res});
        }
    });
};

UsuarioManager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.usuario.*'] = me.executaCrud.bind(me);
    me.listeners['rtc.logar'] = me.trataLogin.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new UsuarioManager();