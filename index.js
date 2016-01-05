var request = require('request');
var postprocess = require('./lib/postprocess.js');
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
            Obj.headers = {};
        }
        Obj.headers.attempt= i+1;
        Obj.headers.max_retry= delay.length +1;
        Obj.headers.tracking_id= uuid.v1();

        request(Obj,function(err,body,r) {
            if(err) {
                return callback(err,null);
            }
            if(nest.get(err,'code') === 'ETIMEDOUT') {
                retryRequest(i,err);
            } else {
                if(!err) {
                    if(Obj.allow) {
                        postprocess(r,Obj.allow,function(err,res) {
                            if(res === false) {
                                return callback('No access',null);
                            } else {
                                return callback(null,r);
                            }
                        });
                    }
                    else {
                        if(err) {
                            return callback(err,null);
                        } else {
                            return callback(null,r);
                        }
                    }
                }
            }
        });
    }
    makeReq();
    function retryRequest(count,err) {
        if( count < delay.length) {
            setTimeout(function(){makeReq();},delay[count]);
        } else {
            return callback(err,null);
        }
        i++;
    }

};


