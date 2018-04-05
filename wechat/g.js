'use strict'
var Wechat = require('./wechat')
var sha1 = require('sha1')
var getRawBody = require('raw-body')
module.exports = (opts) => async function(ctx, next) {
    var wechat = new Wechat(opts)

    var token = opts.token
    var signature = ctx.query.signature
    var nonce = ctx.query.nonce
    var echostr = ctx.query.echostr
    var timestamp = ctx.query.timestamp
    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)

    if(ctx.method === 'GET'){
        if (sha === signature) {
            ctx.body = echostr + ''
        } else {
            ctx.body = 'wong'
        }
    }else if(ctx.method === 'POST'){
        if(sha!==signature){
            ctx.body = 'wong'
            return false
        }else{
            var data  = ctx.request.body.xml
            var msg='你好'
            console.log(data)
            if(data.MsgType[0]=='event' && data.Event[0]=='subscribe'){
                var now = new Date().getTime()
                ctx.status = 200
                ctx.type='application/xml'
                ctx.response.body = '<xml> <ToUserName>< ![CDATA['+
                data.ToUserName
                +'] ]></ToUserName> <FromUserName>< ![CDATA['+
                data.FromUserName
                +'] ]></FromUserName> <CreateTime>'+now+'</CreateTime> <MsgType>< ![CDATA[text] ]></MsgType> <Content>< ![CDATA['+
                msg
                +'] ]></Content> </xml>'


            }
        
        }
    }

    await next()
}