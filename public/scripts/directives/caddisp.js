/**
 * Created by Osvaldo on 26/11/15.
 */

app.directive('caddisp', [function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{},
        templateUrl: '../../partial/caddisp.html',

        link: function(scope, element){
            var me = this;
            me.listeners = {};
            scope.conferencia = {
                tipo: '',
                marca: '',
                modelo: ''
            };
            scope.situacoes = [];
            scope.modelos = [];

            scope.cadastrarDispositivo = function(){
                scope.disp.modelo = JSON.parse(scope.disp.modelo);
                scope.disp.situacao = JSON.parse(scope.disp.situacao);
                scope.disp.x = 0;
                scope.disp.y = 0;
                var msg = new Mensagem(me, 'dispositivo.create', scope.disp, 'dispositivo');
                SIOM.emitirServer(msg);
            };

            me.retdipscad = function (msg) {
                console.log('retornou o disp cadastrado', msg.getDado());
            };

            me.fazpedidos = function(){
                var solicitacoes = {
                    modelodisps: new Mensagem(me, 'modelodisp.read', {}, 'modelodisp'),
                    situacoes: new Mensagem(me, 'situacao.read', {}, 'situacao')
                };

                for(var pedido in solicitacoes){
                    SIOM.emitirServer(solicitacoes[pedido]);
                }
            };

            scope.setaMarcaModeloTipo = function(){
                var modeloselecionado = JSON.parse(scope.disp.modelo);
                scope.conferencia.modelo = modeloselecionado.modelo;
                scope.conferencia.marca = modeloselecionado.marca;
                scope.conferencia.tipo = modeloselecionado.tipodisp;
            };

            me.lidoModelos = function(msg){
                scope.modelos =  msg.getDado();
                scope.$apply();
            };

            me.lidoSituacoes = function(msg){
                scope.situacoes = msg.getDado();
                scope.$apply();
            };

            me.wiring = function(){
                me.listeners['modelodisp.readed'] = me.lidoModelos.bind(me);
                me.listeners['situacao.readed'] = me.lidoSituacoes.bind(me);
                me.listeners['dispositivo.created'] = me.retdipscad.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }

                me.fazpedidos();
            };

            me.wiring();
        }
    };
}]);