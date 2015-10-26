/**
 * Created by Osvaldo/Gustavo on 22/10/15.
 */

function ConfigRotas($routeProvider) {
    console.log('aquiiii');
    var me = this;
    me.route = $routeProvider;

    me.rotas = {};

    me.wiring = function(){

        me.route.when('/', {templateUrl: '../views/home.html', controller: 'homeController'});
        SIOM.on('setarota', me.setaRota.bind(me));
    };

    me.alunoJogo = function(){

        me.rotas['/jogoAluno'] = {templateUrl: '../views/jogoAluno.html', controller: 'jogoAlunoController'};
    };

    me.profLogado = function(){

        me.rotas['/prepararJogo'] = {templateUrl: '../views/prepararJogo.html', controller: 'prepararJogoController'};
        me.rotas['/jogoProfessor'] = {templateUrl: '../views/jogoProfessor.html', controller: 'jogoProfessorController'};
    };

    me.adminLogado = function(){

        me.alunoJogo();
        me.profLogado();
        me.rotas['/cadProf'] = {templateUrl: '../views/cadastraProf.html', controller: 'cadastraProfController'};

    };

    me.setaRota = function(tipoUser){
        switch(tipoUser){
            case 0:
                me.adminLogado();
                break;
            case 1:
                me.profLogado();
                break
        }

        for(var name in me.rotas){
            me.route.when(name, me.rotas[name]);
        }
    };

    me.wiring();
}

app.config(ConfigRotas);