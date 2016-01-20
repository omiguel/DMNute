/**
 * Created by Osvaldo on 19/01/16.
 */

app.directive('editadisp', function(){
    return{
        restrict: 'E',
        transclude: true,
        templateUrl: '../../partial/editadisp.html',
        link: function(scope, element){
            var me = this;
            me.listeners = {};
            scope.editDisp = {};
            scope.mapaatual = {};
            scope.mapas = [];

            me.setDisp = function(disp){
                scope.editDisp = disp;
                var atual = {
                    nome: 'Selecione um mapa',
                    img: '/image/mapa/semmapa.JPG'
                };
                if(disp.mapa){
                    atual.nome = disp.mapa.nome;
                    atual.img = disp.mapa.img;
                }
                scope.mapaatual.atual = atual;
                console.log('que porra é essa?', scope.mapaatual);
            };

            me.recebeMapas = function(mapas){
                scope.mapas = mapas;
            };

            me.wiring = function(){
                me.listeners['editadisp'] = me.setDisp.bind(me);
                me.listeners['mapasprontos'] = me.recebeMapas.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

            me.wiring();

        }
    };
});
