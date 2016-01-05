var async = require('async');
var nest = require('nestcheck');
module.exports = function(object,allow,callback) {
    var accountMatch = false;
    if(object.getUser === 'failed') {
        return callback('User not found',null);
    }
    async.forEachOf(allow,function(value,key,callback) {
        if(key === '') {
            accountMatch = true;
            return callback();
        }
        if(nest.get(JSON.parse(object), 'account.account_id') === key) {
            accountMatch = true;
        }
        if(value.Must.length +value.MustNot.length === 0) {
            return callback();
        }
        if(value.Must.length >0) {
            async.each(value.Must,function(val,callback) {
                if(nest.get(JSON.parse(object), val.type) !== val.id) {
                    callback('Do not have the proper permissions to do this action',null)
                } else {
                    callback();
                }
            },function(err) {
                return callback(err,null);
            });
        }
        if(value.MustNot.length > 0) {
            async.each(value.MustNot,function(val,callback) {
                if(nest.get(JSON.parse(object), val.type) === val.id) {
                    callback('Do not have the proper permissions to do this action',null)
                } else {
                    callback();
                }
            },function(err) {
                return callback(err,null);
            });
        }
    },function(err) {
        if(!err && accountMatch ===true) {
            return callback(null,true);
        } else {
            return callback(err,false);
        }
    })
};
