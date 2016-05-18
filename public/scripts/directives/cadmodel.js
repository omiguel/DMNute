/**
 * Created by Osvaldo on 27/11/15.
 */

app.directive('cadmodel', ['utilFactory', function(utilFactory){
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

            me.salvaImagem = function(msg){
                var dado = msg.getDado();
                var file = element.find('input.file')[0].files[0];
                var iddisp = dado._id;

                var retorno = function(data){
                    dado.caminhoimg = data.localImagem;
                    var msg = new Mensagem(me, 'modelodisp.update', dado, 'modelodisp');
                    SIOM.emitirServer(msg);
                };

                utilFactory.upImagem(iddisp, file, 'modelo', retorno);
            };

            me.wiring = function(){

                me.listeners['modelodisp.created'] = me.salvaImagem.bind(me);
                me.listeners['modelodisp.updated'] = me.modeloCriado.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

            me.wiring();
        }
    };
}]);