/**
 * Created by Osvaldo on 05/10/15.
 */

app.controller("loginController",['$scope', '$location', function ($scope, $location) {
    $scope.listeners = {};

    $scope.wind = "/home";

    $scope.logar = function(){
        var msg = new Mensagem('logar', $scope, $scope.usuario);

        SIOM.logar(msg);

    };

    $scope.logou = function(msg){

        console.log('recebi o login', msg);
//        console.log('estou aquiii', $scope.wind);
//        $location.path($scope.wind);

    };

    $scope.wiring = function(){
        var sion = SIOM;

        $scope.listeners={
            'usuario.logou': $scope.logou.bind($scope)
        };

        for(var name in $scope.listeners){

            sion.on(name, $scope.listeners[name]);

        }

    };

    $scope.wiring();

}]);