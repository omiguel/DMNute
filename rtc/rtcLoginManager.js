/**
 * Created by Osvaldo on 16/10/15.
 */

var hub = require('../hub/hub.js');
var utility = require('util');
var Mensagem = require('../util/mensagem.js');
var basico = require('./basicRtc.js');
var rtcRoot = require('./rtcRoot.js');
var rtcAdmin = require('./rtcAdmin');
var rtcComum = require('./rtcComum');
utility.inherits(RtcLoginManager, basico);

function RtcLoginManager(conf){
    var me = this;
    me.config = conf;
    me.listeners = {};

    console.log('estou no novo rtcLogin', me.config.socket.id);

    me.wiring();
    me.loginWiring();
}

RtcLoginManager.prototype.loginWiring = function(){
    var me = this;
    me.config.socket.on('logar', function(msgDoBrowser){
        console.log('cheguei aqui no rtc ', 'rtc.'+msgDoBrowser.evento, msgDoBrowser);
        hub.emit('rtc.'+msgDoBrowser.evento,me.convertMessageFromBrowserToServer(msgDoBrowser));
    });
};

/**
 * Funcao que recebe o retorno do banco, se vier um usuario ele verifica o tipo para iniciar o rtc que representa
 * este user no server e informa a interface, se nao veio usuario ele informa a interface.
 *
 * @param msg
 */
RtcLoginManager.prototype.trataLogin = function(msg){
    var me = this;

    if(msg.getRtc() == me){
        var dado = msg.getDado();
        console.log('chegou a resposta pro rtc', dado);
        me.emitePraInterface(msg);
        switch (dado.tipo){
            case 0:
                console.log('cheguei no switch');
                new rtcRoot(me.config);
                break;
            case 1:
                new rtcAdmin(me.config);
                break;
            case 2:
                new rtcComum(me.config);
                break;
        }
    }
};

RtcLoginManager.prototype.wiring = function(){
    var me = this;

    me.listeners={
        'login': me.trataLogin.bind(me)
    };

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = RtcLoginManager;