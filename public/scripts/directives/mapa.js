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
                for(var disp in scope.dispositivos){
                    console.log('os ids', scope.dispositivos[disp]);
                }
            };

            me.wiring = function(){
                me.listeners['mapaatual'] = me.recebemapaatual.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

            me.wiring();
        }
    };
});