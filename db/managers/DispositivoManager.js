/**
 * Created by Osvaldo on 20/10/15.
 */


var Manager = require('./manager.js');
var utility = require('util');
var Model = require('../model/dispositivo.js');
var hub = require('../../hub/hub.js');
var Mensagem = require('../../util/mensagem.js');
utility.inherits(DispositivoManager, Manager);

/**
 * @constructor
 */
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
 *
 * @param msg
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

/**
 * Funcao que busca no banco os dispositivos e popula situacao, modelo e mapa.
 *
 * @param msg
 */
DispositivoManager.prototype.getDispComplete = function(msg){
    var me = this;
    var dados = msg.getRes();
    this.model.find()
        .populate('situacao modelo mapa')
        .exec(function(err, res){
            if(err){
                me.emitManager(msg, '.error.readed', {err: er});
            } else{
                me.emitManager(msg, '.readed', {res: res});
            }
        });
};

DispositivoManager.prototype.pedesituacao = function (msg) {
    var me = this;
    hub.emit('getsituacaogaurdado', msg);
};

DispositivoManager.prototype.completeguardadisps = function (msg, quantos) {
    var me = this;
    var conterro = 0;
    var maparet = msg.getRes();
    var arrdisps = maparet.disps;

    if(quantos > 0){
        var disp = arrdisps[quantos - 1];
        disp.mapa = null;
        disp.x = 0;
        disp.y = 0;
        this.model.findByIdAndUpdate(disp._id, {$set: disp}, function(err, res){
            if(res){
                conterro = 0;
                me.completeguardadisps(msg, quantos -1);
            } else{
                if(conterro < 3){
                    me.completeguardadisps(msg, quantos);
                } else {
                    console.log('errou demais', msg.getRes(), quantos);
                }
            }
        })
    } else {
        console.log('terminou aqui');
        hub.emit('dispsguardados', msg);
    }
};

DispositivoManager.prototype.guardadisp = function (msg) {
    var me = this;
    var mapa = msg.getRes();
    var quantos = mapa.disps.length;
    me.completeguardadisps(msg, quantos);
};

/**
 * Faz a ligacao dos evendos que essa classe vai escutar, e liga as funcoes que serao executadas 
 */
DispositivoManager.prototype.wiring = function(){
    var me = this;
    me.listeners['banco.dispositivo.*'] = me.executaCrud.bind(me);
    me.listeners['rtc.dispositivocomplete.read'] = me.getDispComplete.bind(me);
    me.listeners['guardadisps'] = me.pedesituacao.bind(me);
    me.listeners['retguardado'] = me.guardadisp.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new DispositivoManager();