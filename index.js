var request = require('request');
var config = require('./config.json');
var uuid = require('uuid');
var nest = require('nestcheck');
module.exports = function(Obj,callback) {
    var delay = config.delay.split(',').map(function(i) {
        return parseInt(i,10);
    });
        Obj.timeout = config.timeout;
    var i = 0;
    function makeReq() {
        if(!Obj.headers) {
            Obj.headers = {}
        }
        Obj.headers = {
            "attempt": i+1,
            "max_retry": delay.length +1,
            "tracking_id": uuid.v1()

        };
        request(Obj,function(err,body,r) {
            if(nest.get(err,'code') === 'ETIMEDOUT') {
                retryRequest(i,err);
            } else {
                return callback(err,r);
            }
        })
    }
    makeReq();
    function retryRequest(count,err) {
        if( count < delay.length) {
            setTimeout(function(){makeReq()},delay[count]);
        } else {
            return callback(err,null)
        }
        i++;
    }

};
