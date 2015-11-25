var assert = require("chai").assert,
    expect = require('chai').expect,
    httpClient = require('../../index.js');
describe('Testing index.js', function() {
    this.timeout(0);
        it('Should run through all retries and then timeout', function(done) {
            httpClient({
                method:'GET',
                url:'http://localhost:3000/long'
            },function(err,r) {
                expect(err.code).to.equal('ETIMEDOUT');
                done();
            });
        });
    it('Should run and not have to retry', function(done) {
        httpClient({
            method:'GET',
            url:'http://localhost:3000/short'
        },function(err,r) {
            expect(err).to.be.a('null');
            done();
        });
    })
});