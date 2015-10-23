/**
 * Created by Osvaldo on 18/10/15.
 */

/**
 * Created by Osvaldo on 16/10/15.
 */

//var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');

function BasicRtc(){
    var me = this;
    me.listeners = {};
}

BasicRtc.prototype.emitePraInterface = function(msg){
    var me = this;
    if(msg.getRtc() == me){
        var msgToBrowser = me.convertMessageFromServerToBrowser(msg);
        me.config.socket.emit('evento',msgToBrowser);
    }
};

BasicRtc.prototype.convertMessageFromBrowserToServer = function(msgDoBrowser){
    var me = this;
    var mensagem = new Mensagem(me); //source == this
    mensagem.fromBrowser(msgDoBrowser, me); //rtc == this
    return mensagem;

};

BasicRtc.prototype.convertMessageFromServerToBrowser = function(mensagem){
    var msgb = mensagem.toBrowser();
    return msgb;
};

BasicRtc.prototype.basicWiring = function(){
//    var me = this;
//
//    me.listeners={
//        'login': me.emitePraInterface.bind(me)
//    };
//
//    for(var name in me.listeners){
//        hub.on(name, me.listeners[name]);
//    }
};

module.exports = BasicRtc;