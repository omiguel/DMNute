(function(){
    var instance;
    var socket = io();


    var SIOM = function() {
        var me = this;

        me.logar = function(msg){
            console.log('logando aqui', msg);
            socket.emit('logar', msg.toServer());
        };

        me.emitir = function(evento, mensagem){

            console.log('no siom', mensagem.getEvento(),mensagem.getDado(), mensagem.toServer());

            socket.emit(mensagem.getEvento(), mensagem.toServer());
        };

        me.trataEventoRecebido = function(ms){
            console.log('escutei evento', ms.evento, socket.id);
            me.emit(ms.evento, ms);
        };

        me.wiring = function(){
            var me = this;

            socket.on('evento', me.trataEventoRecebido.bind(me));

        };
        me.wiring();
    };

    SIOM.prototype=  new EventEmitter2({
        wildcard: true,
        newListener: true,
        maxListeners:200
    });

    SIOM.prototype.constructor = SIOM;

    window.SIOM = new SIOM();

})();