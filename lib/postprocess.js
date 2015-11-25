module.exports = function(object,allow,callback) {
    if(object.getUser === 'failed') {
        return callback('User not found',null);
    }
    async.forEachOf(allow,function(value,key,callback) {
        if(key === '') {
            return callback();
        }
        if(value.Must.length +value.MustNot.length === 0) {
            return callback();
        }
        if(value.Must.length >0) {
            async.each(value.Must,function(val,callback) {
                if(object[val.type] !== val.id) {
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
                    if(object[val.type] === val.id) {
                        callback('Do not have the proper permissions to do this action',null)
                    } else {
                        callback();
                    }
            },function(err) {
                return callback(err,null);
            });
        }
    },function(err) {
        if(!err) {
            return callback(null,true);
        } else {
            return callback(err,false);
        }
    })
};
