'use strict'
var koa = require('koa')
var sha1 = require('sha1')

var app = new koa()
module.exports = (opts) => function(ctx, next) {
    console.log(opts)
    console.log(ctx.query)
    var token = opts.token
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
    next(ctx, next)
}