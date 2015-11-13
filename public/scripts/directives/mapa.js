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

            me.setMapa = function(img){
                scope.imagem = img;
                scope.$apply();
            };

            me.wiring = function(){
                me.listeners['start'] = me.setMapa.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

            me.wiring();
        }
    };
});