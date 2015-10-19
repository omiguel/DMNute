/**
 * Created by Osvaldo on 19/10/15.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');
var utility = require('util');
var basico = require('./basicRtc.js');
utility.inherits(RtcAdmin, basico);

function RtcAdmin(conf){
    var me = this;
    me.config = conf;

    console.log('rtcRoottttt', me.config.socket.id);

    me.wiring();
    me.interfaceWiring();
}

RtcAdmin.prototype.wiring = function(){
    var me = this;

    me.listeners={
        'usuario.*': me.emitePraInterface.bind(me)
    };

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};


RtcAdmin.prototype.interfaceWiring = function(){
    var me = this;
    me.config.socket.on('evento', function(msgDoBrowser){
        console.log('cheguei aqui no rtc ', 'rtc.'+msgDoBrowser.evento, msgDoBrowser);
        hub.emit('rtc.'+msgDoBrowser.evento,me.convertMessageFromBrowserToServer(msgDoBrowser));
    });
};

module.exports = RtcAdmin;