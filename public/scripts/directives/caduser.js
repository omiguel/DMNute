/**
 * Created by Osvaldo on 29/09/15.
 */

app.directive('caduser', ['utilFactory', function(utilFactory){
    return{
        restrict: 'E',
        transclude: true,
        scope:{},
        templateUrl: '../../partial/caduser.html',

        link: function(scope, element){
            var me = this;
            me.listeners = {};

            scope.tipoUser = {
                tipoSelecionado: 'Selecione o tipo',
                tipos: [
                    {id: 1, nome: "Administrador"},
                    {id: 2, nome: "Usuario comum"}
                ]
            };

            scope.cadastrarUsuario = function(){
                console.log('estou cadastrando esse cara', scope.user);
                var msg = new Mensagem(me, 'usuario.create', scope.user, 'usuario');
                SIOM.emitirServer(msg);
            };

            me.salvaImagem = function(msg){
                var dado = msg.getDado();
                var file = element.find('input.file')[0].files[0];
                var iduser = dado._id;
                var retorno = function(data){
                    dado.imagem = data.localImagem;
                    var msg = new Mensagem(me, 'usuario.update', dado, 'usuario');
                    SIOM.emitirServer(msg);
                };
                utilFactory.upImagem(iduser, file, 'usuario', retorno);
            };

            me.informaNovoUser = function(){
                SIOM.emit('novoUserCadastrado');
            };

            me.teste = function(msg){
                console.log('chegou do server', msg);
            };

            me.wiring = function(){
                me.listeners['usuario.created'] = me.salvaImagem.bind(me);
                me.listeners['usuario.updated'] = me.informaNovoUser.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

            me.wiring();
        }
    };
}]);