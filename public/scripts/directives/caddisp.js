/**
 * Created by Osvaldo on 26/11/15.
 */

app.directive('caddisp', ['utilFactory', function(utilFactory){
    return{
        restrict: 'E',
        transclude: true,
        scope:{},
        templateUrl: '../../partial/caddisp.html',

        link: function(scope, element){
            var me = this;
            me.listeners = {};

            scope.tipoDisp = {
                tipoSelecionado: 'Selecione o tipo',
                tipos: [
                    {id: 1, nome: "Administrador"},
                    {id: 2, nome: "Usuario comum"}
                ]
            };

            scope.cadastrarDispositivo = function(){
                console.log('aqui vou comecar a nova saga de cadastro.');
            };

            me.wiring = function(){

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

//            me.wiring();
        }
    };
}]);