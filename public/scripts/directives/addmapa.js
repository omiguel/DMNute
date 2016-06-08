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
            scope.mapas = [];
            scope.mapa = {};
            scope.mapamodel = {
                atual: {
                    nome: 'Selecione um mapa',
                    img: '/image/mapa/semmapa.JPG'
                }
            };

            scope.tipos = [
                {
                    nome: 'mapa pai',
                    value: 1
                },
                {
                    nome: 'mapa filho',
                    value: 0
                }
            ];

            scope.trocaMapa = function(){
                scope.mapamodel.atual = JSON.parse(scope.mapamodel.novo);
            };

            scope.adicionarMapa = function(){

                if(scope.mapamodel.atual._id){
                    var pai = angular.copy(scope.mapamodel.atual);
                    delete pai.disps;
                    scope.mapa.pai = pai;
                } else {
                    delete scope.mapa.pai;
                }

                var msg = new Mensagem(me, 'mapa.create', scope.mapa, 'mapa');
                SIOM.emitirServer(msg);

            };

            me.salvaImagem = function(msg){
                var dado = msg.getDado();
                var file = element.find('input.file')[0].files[0];
                var idmapa = dado._id;
                var retorno = function(data){
                    dado.img = data.localImagem;

                    var msg = new Mensagem(me, 'mapa.update', dado, 'mapa');
                    SIOM.emitirServer(msg);
                };
                utilFactory.upImagem(idmapa, file, 'mapa', retorno);
            };

            me.informaNovoMapa = function(msg){

                scope.mapas = [];
                scope.mapa = {};
                scope.mapamodel = {
                    atual: {
                        nome: 'Selecione um mapa',
                        img: '/image/mapa/semmapa.JPG'
                    }
                };

                $('#addmapa').modal('toggle');

                SIOM.emit('novoMapa');
            };

            me.recebeMapas = function(mapas){

                for(var map in mapas){
                    if(mapas[map].ehapai){
                        scope.mapas.push(mapas[map]);
                    }
                }
            };

            me.wiring = function(){
                me.listeners['mapa.created'] = me.salvaImagem.bind(me);
                me.listeners['mapa.updated'] = me.informaNovoMapa.bind(me);
                me.listeners['mapasprontos'] = me.recebeMapas.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

            me.wiring();

        }
    };
}]);