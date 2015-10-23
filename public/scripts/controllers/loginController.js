/**
 * Created by Osvaldo on 05/10/15.
 */

app.controller("loginController",['$scope', '$location', 'setUserLogado', '$route',function ($scope, $location, setUserLogado, $route) {
    var me = this;
    me.listeners = {};

    me.wind = "/home";

    $scope.logar = function(){
        var msg = new Mensagem(me, 'logar', $scope.usuario, 'usuario');

        SIOM.logar(msg);

    };

    me.logou = function(msg){

        setUserLogado.setLogado(msg.getDado());
        console.log('estou aquiii', me.wind);
        $location.path(me.wind);
        $route.reload();
    };

    me.serverError = function(msg){
        //todo criar um box de aviso que informa erros e sucessos
        console.log('error', msg);
    };

    me.invalidUser = function(msg){
        //todo criar um box de aviso que informa erros e sucessos
        console.log('invalidUser', msg);
    };

    me.wiring = function(){
        me.listeners['usuario.login'] = me.logou.bind(me);
        me.listeners['usuario.error.logar'] = me.serverError.bind(me);
        me.listeners['usuario.invaliduser'] = me.invalidUser.bind(me);

        for(var name in me.listeners){

            SIOM.on(name, me.listeners[name]);

        }

    };

    me.wiring();

}]);