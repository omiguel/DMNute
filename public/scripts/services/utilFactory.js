/**
 * Created by Osvaldo on 24/11/15.
 */

app.factory('utilFactory', ['$http', function($http){
    var methods = {
        /**
         * servico responsavel por mandar a imagem para o servidor.
         *
         * @param objctid
         * @param file
         * @param flag
         * @param calback
         */
        upImagem: function(objctid, file, flag, calback){
           // console.log('id', objctid, 'file', file, 'flag', flag);
            if(!objctid || !file || !flag){
                throw new Error("Não é possivel salvar sem os parametros solicitados");
            }

            var fd = new FormData();
            fd.append('doque', flag);
            fd.append('id', objctid);
            fd.append('file', file);
            var cb = calback? calback : function(){};

            $http.post('/upimage', fd, {
                transformRequest: function(data, headersGetterFunction) {
                    return data;
                },
                headers: { 'Content-Type': undefined }
            }).success(function(data, status) {
                console.log('retornou aqui');
                cb(data);
            }).error(function(data, status) {
                alert("Error ... " + status);
            });
        }
    };
    return methods;
}]);