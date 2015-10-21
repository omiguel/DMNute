/**
 * Created by Osvaldo on 06/10/15.
 */
var hub = require('../../hub/hub.js');

var types = require('../Banco.js').mongoose.Schema.Types;


function Manager() {
    console.log("manager iniciado");
}

Manager.prototype.create = function(msg){
    var me = this;
    var dados = msg.getDado();
    this.model.create(dados, function(err, res){
        if(res){
            var evt = msg.getFlag()+'.created';
            var msgRet = msg.next(me, evt, res, 'usuario');
            hub.emit(msgRet.getEvento(), msgRet);
        }
    })
};

Manager.prototype.read = function(msg){
    var dados = msg.getDado();
    if(dados.id){
        this.model.findById(dados.id, function(err, res){
            console.log('estou no read', err, res);
        })
    } else{
        this.model.find(function(err, res){
            console.log('estou no read sem id', err, res);
        })
    }
};

Manager.prototype.update = function(msg){
    var dados = msg.getDado();
    this.model.findByIdAndUpdate(dados._id, {$set: dados}, function(err, res){
        console.log('estou no update', err, res);
    })
};

Manager.prototype.destroy = function(msg){
    var dados = msg.getDado();
    this.model.remove({_id: dados.id}, function(err, res){
        console.log('estou no destroy', err, res);
    })
};

module.exports = Manager;