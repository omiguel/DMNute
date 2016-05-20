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
            scope.mapamodel = {};
            scope.situacaomodel = {};
            scope.mapas = [];
            scope.situacoes = [];

            me.setDisp = function(disp){
                scope.editDisp = disp;
                scope.situacaomodel.atual = disp.situacao;
                var atual = {
                    nome: 'Selecione um mapa',
                    img: '/image/mapa/semmapa.JPG'
                };
                if(disp.mapa){
                    atual.nome = disp.mapa.nome;
                    atual.img = disp.mapa.img;
                }
                scope.mapamodel.atual = atual;
            };

            me.recebeMapas = function(mapas){

                for(var map in mapas){
                    if(!mapas[map].ehapai){
                        scope.mapas.push(mapas[map]);
                    }
                }
                
            };

            scope.trocaMapa = function(){
                scope.mapamodel.atual = JSON.parse(scope.mapamodel.novo);
            };

            me.recebeSituacao = function(msg){
                scope.situacoes = msg.getDado();
            };

            scope.salvarEdicao = function(){
                if(scope.mapamodel.novo){
                    scope.editDisp.mapa = JSON.parse(scope.mapamodel.novo);
                }
                if(scope.situacaomodel.novo){
                    scope.editDisp.situacao = JSON.parse(scope.situacaomodel.novo);
                }
                var dispEditado = new Mensagem(me, 'dispositivo.update', scope.editDisp, 'dispositivo');
                SIOM.emitirServer(dispEditado);
            };

            me.editou = function(msg){
                //todo, avisar ao usuario que as alteracoes foram salvas com sucesso.
                scope.limpaModels();
            };

            scope.limpaModels = function(){
                delete scope.mapamodel.novo;
                delete scope.situacaomodel.novo;
            };

            me.wiring = function(){
                me.listeners['editadisp'] = me.setDisp.bind(me);
                me.listeners['mapasprontos'] = me.recebeMapas.bind(me);
                me.listeners['situacao.readed'] = me.recebeSituacao.bind(me);
                me.listeners['dispositivo.updated'] = me.editou.bind(me);

                for(var name in me.listeners){
                    SIOM.on(name, me.listeners[name]);
                }
            };

            me.wiring();

        }
    };
});
