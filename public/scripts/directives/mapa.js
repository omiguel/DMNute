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
            scope.teste = {};

            me.recebemapaatual = function (mapa) {
                scope.dispositivos = mapa.disps;
                scope.teste = scope.dispositivos[0];
                console.log('o benedito nome', scope.teste);
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