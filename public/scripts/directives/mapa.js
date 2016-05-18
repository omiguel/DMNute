/**
 * Created by Osvaldo on 23/09/15.
 */

app.directive('mapa', function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{
            imagem: '='
        },
        templateUrl: '../../partial/mapa.html',
        link: function(scope, element){
            var me = this;
            me.listeners = {};
            scope.dispositivos = [];
            me.mapacompleto = {};
            me.listenergambi = {};

            me.recebemapaatual = function (mapa) {
                me.mapacompleto = mapa;
                scope.dispositivos = mapa.disps;
            };

            SIOM.on('dispnovaposicao', function (disp) {
                var salva = null;
                for(var index in scope.dispositivos){
                    if(scope.dispositivos[index]._id == disp.id){
                        salva = scope.dispositivos[index];
                        break;
                    }
                }
                salva.x = disp.x;
                salva.y = disp.y;

                var msg = new Mensagem(me, 'dispositivo.update', salva, 'dispmapa');
                SIOM.emitirServer(msg);

            });

            var retornosetposition = function (msg) {
                console.log('retorno sucesso', msg.getDado());
            };

            me.wiring = function(){
                me.listeners['mapaatual'] = me.recebemapaatual.bind(me);
                me.listeners['dispmapa.updated'] = retornosetposition.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

            me.wiring();
        }
    };
});