/**
 * Created by Osvaldo on 27/11/15.
 */

app.directive('cadmodel', [function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{},
        templateUrl: '../../partial/cadmodel.html',

        link: function(scope, element){
            var me = this;
            me.listeners = {};

            scope.cadastrarModelo = function(){
                var msg = new Mensagem(me, 'modelodisp.create', scope.modelo, 'modelodisp');
                SIOM.emitirServer(msg);
            };

            scope.setaModelo = function(){
                var tipo = scope.modelo.tipodisp? scope.modelo.tipodisp : "";
                var marca = scope.modelo.marca? scope.modelo.marca : " ";
                var model = scope.modelo.modelo? scope.modelo.modelo : "";
                scope.modelo.apresentacao = tipo+"_"+marca+"_"+model;
            };

            me.modeloCriado = function(msg){
                console.log('chegou o modelo criado', msg);
            };

            me.wiring = function(){

                me.listeners['modelodisp.created'] = me.modeloCriado.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

            me.wiring();
        }
    };
}]);