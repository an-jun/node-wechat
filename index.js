'use strict'
var koa = require('koa')
var sha1 = require('sha1')
var config = {
    wechat: {
        appID: 'wx4c10dcbc112ceaeb',
        appSecret: '6f802e7cef82c74596b9760e3b31f4ff',
        token: 'd027us7DzEzod7So0ddTE27KZyEUZoFo'
    }
}
var app = new koa()
app.use(function(ctx, next) {
    console.log(ctx.query)
    var token = config.wechat.token
    var signature = ctx.query.signature
    var nonce = ctx.query.nonce
    var echostr = ctx.query.echostr
    var timestamp = ctx.query.timestamp
    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)
    console.log(echostr + '')
    console.log(signature)
    if (sha === signature) {
        ctx.body = echostr + ''
    }
})
app.listen(1234)
console.log('listening:1234')