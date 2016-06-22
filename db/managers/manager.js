/**
 * Created by Osvaldo on 06/10/15.
 */
var hub = require('../../hub/hub.js');

var types = require('../Banco.js').mongoose.Schema.Types;

/**
 * @constructor
 */
function Manager() {
    console.log("manager iniciado");
}

/**
 * Cria um determinado objeto no bd
 * 
 * @param msg
 */
Manager.prototype.create = function(msg){
    var me = this;
    var dados = msg.getRes();
    console.log('chegou no create?', dados);
    this.model.create(dados, function(err, res){
        if(res){
            me.emitManager(msg, '.created', {res: res});
        } else{
            me.emitManager(msg, '.error.created', {err: err});
            console.log('erro no create', err);
        }
    })
};

/**
 * le um determinado obj no bd
 * 
 * @param msg
 */
Manager.prototype.read = function(msg){
    var me = this;
    var dados = msg.getRes();
    if(dados._id){
        this.model.findById(dados._id, function(err, res){
            if(res){
                me.emitManager(msg, '.readed', {res: res});
            } else{
                me.emitManager(msg, '.error.readed', {err: err});
            }
        })
    } else{
        this.model.find(function(err, res){
            if(res){
                me.emitManager(msg, '.readed', {res: res});
            } else{
                me.emitManager(msg, '.error.readed', {err: err});
            }
        })
    }
};

/**
 * atualiza um determinado objto no bd
 * 
 * @param msg
 */
Manager.prototype.update = function(msg){
    var me = this;
    var dados = msg.getRes();
    this.model.findByIdAndUpdate(dados._id, {$set: dados}, function(err, res){
        if(res){
            me.model.findById(dados._id, function(err, res){
                if(res){
                    me.emitManager(msg, '.updated', {res: res});
                } else{
                    me.emitManager(msg, '.error.readedupdated', {err: err});
                }
            });
        } else{
            me.emitManager(msg, '.error.updated', {err: err});
        }
    })
};

/**
 * destroi um determinado objeto no bd
 * 
 * @param msg
 */
Manager.prototype.destroy = function(msg){
    var me = this;
    var dados = msg.getRes();
    this.model.remove({_id: dados._id}, function(err, res){
        if(res){
            console.log('destrui certo', err, res);
            me.emitManager(msg, '.destroied', {res: res});
        } else{
            console.log('deu erro no destroy', err);
            me.emitManager(msg, '.error.destroied', {err: err});
        }
    })
};

/**
 * recebe uma msg já utilizada, atualiza o evento e o dado, e a envia novamente.
 * 
 * @param msgAntiga
 * @param subEvt
 * @param dado
 */
Manager.prototype.emitManager = function(msgAntiga, subEvt, dado){
    var me = this;
    var evt = msgAntiga.getFlag()+subEvt;
    var retorno = msgAntiga.next(me, evt, dado, msgAntiga.getFlag());
    hub.emit(retorno.getEvento(), retorno);
};

module.exports = Manager;