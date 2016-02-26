/**
 * Created by Osvaldo on 29/09/15.
 */

app.directive('addmapa', ['utilFactory', function(utilFactory){
    return{
        restrict: 'E',
        transclude: true,
        scope:{},
        templateUrl: '../../partial/addmapa.html',
        link: function(scope, element){
            var me = this;
            me.listeners = {};

            scope.adicionarMapa = function(){
                console.log("novo mapa eh ", scope.mapa);
                var msg = new Mensagem(me, 'mapa.create', scope.mapa, 'mapa');
                SIOM.emitirServer(msg);
            };

            me.salvaImagem = function(msg){
                var dado = msg.getDado();
                var file = element.find('input.file')[0].files[0];
                var idmapa = dado._id;
                var retorno = function(data){
                    dado.img = data.localImagem;
                    console.log('aqui no salvaimagemmapa', data.localImagem);
                    var msg = new Mensagem(me, 'mapa.update', dado, 'mapa');
                    SIOM.emitirServer(msg);
                };
                utilFactory.upImagem(idmapa, file, 'mapa', retorno);
            };

            me.informaNovoMapa = function(msg){
                console.log('deu update aqui', msg);
                SIOM.emit('novoMapa');
            };

            me.wiring = function(){
                me.listeners['mapa.created'] = me.salvaImagem.bind(me);
                me.listeners['mapa.updated'] = me.informaNovoMapa.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

            me.wiring();

        }
    };
}]);