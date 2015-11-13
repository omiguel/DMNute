/**
 * Created by Osvaldo on 23/09/15.
 */

app.directive('cabecalho', function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{
            userlogado: '=',
            mapa: '='
        },
        templateUrl: '../../partial/cabecalho.html',
        link: function(scope, element){
            console.log('scope', scope.nomelogado, scope.nomemapa);

            var me = this;
            me.listeners = {};

            scope.visuser = {};
            scope.mostrauser = false;
            scope.cadastrados = [];

            scope.buscandoesse = function(){
                console.log(scope.buscando);
            };

            scope.addmapa = function(){
                console.log('chama um form pra addMapa');
            };

            scope.caduser = function(){
                console.log('chama um form pra cadastrarUser')
            };

            scope.showuser = function(user){
                console.log('quero ver os dados desse cara', user);
                scope.visuser = user;
            };

            scope.showuserlogado = function(){
                console.log('quero ver minhas configs, aqui vou poder mudar minhas configs', scope.nomelogado);
                scope.mostrauser = scope.mostrauser? false: true;
            };

            scope.showdadosmapa = function(){
                console.log('quero ver os dados do mapa, os admins podem configurar', scope.nomemapa);
            };

            me.fazPedidos = function(){
                var solicitacoes = {
                    cadastrados: new Mensagem(me, 'cadastrados', {}, 'usuario')
                };

                for(var pedido in solicitacoes){
                    SIOM.emitirServer(solicitacoes[pedido]);
                }

            };

            me.setCadastrados = function(msg){
                scope.cadastrados = msg.getDado();
                scope.$apply();
            };

            me.wiring = function(){
                me.listeners['usuario.pegacadastrados'] = me.setCadastrados.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }

                me.fazPedidos();
            };

            me.wiring();
        }
    };
});
