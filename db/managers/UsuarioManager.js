
var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/usuario.js');
var hub = require('../../hub/hub.js');

function UsuarioManager(){
    var me = this;
    Manager.call(me);
    me.model = Model;
    me.listeners = {};

//    var criaprimeirouser = function(){
//
//        var dados = {login: 'osvaldo', senha: 'osvaldo', tipo: 0};
//
//        me.model.create(dados, function(err, res){
//            console.log('estou no create', err, res);
//        })
//    };
//
//    criaprimeirouser();

    me.wiring();
}

utility.inherits(UsuarioManager, Manager);

/**
 * Inicia o tratamento dos namespace dos eventos, method recebe o nome da função
 * que vai ser executada por meio da herança.
 */
UsuarioManager.prototype.executaCrud = function(msg){
    var me = this;
    console.log('escutei no usuario', msg);
    var method = msg.getEvento().substr(msg.getEvento().lastIndexOf('.')+1);
    console.log(method);
    try {
        me[method](msg);
    }catch (e){
        hub.emit('error.manager.usuario', e);
    }
};

UsuarioManager.prototype.trataLogin = function(msg){
    var dado = msg.getDado();
    console.log('estou chegando aqui', msg.getEvento(), dado);

    this.model.findOne({'login': dado.login, 'senha': dado.senha}, function(err, res){
        console.log('voltou do bando', err, res)
        if(res){
            console.log('voltou do banco', res);
            msg.setEvento('login');
            msg.setDado(res);
            hub.emit(msg.getEvento(), msg);
        } else{
            //todo tratar o erro.
            if(err){
                console.log('veio um erro do banco', err);
            } else{
                msg.setEvento('invaliduser');
                msg.setDado(res);
                hub.emit(msg.getEvento(), msg);
            }
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