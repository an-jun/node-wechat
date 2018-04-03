'use strict'
var koa = require('koa')
var sha1 = require('sha1')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
    accessToken: prefix + 'token?grant_type=client_credential'
}

function Wechat(opts) {
    var that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.getAccessToken().then(function(data) {
        try {
            data = JSON.parse(data)
        } catch (e) {
            return that.updateAccessToken()
        }
        if (that.isValidAccessToken(data)) {
            Promise.resolve(data)
        } else {
            return that.updateAccessToken()
        }
    }).then(function(data) {
        console.log('saveAccessToken:')
        console.log(data)
        that.access_token = data.access_token
        that.expires_in = data.expires_in
        that.saveAccessToken(JSON.stringify(data))
    })
}
Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }
    var access_token = data.access_token
    var expires_in = data.expires_in
    var now = (new Date().getTime())
    if (now < expires_in) {
        return true
    } else {
        return false
    }
}
Wechat.prototype.updateAccessToken = function() {
    console.log('updateAccessToken:')
    var appID = this.appID
    var appSecret = this.appSecret
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret
    console.log(url)
    return new Promise(function(resolve, reject) {
        request({ url: url, json: true }).then(function(res) {
            console.log('res.body')
            console.log(res.body)
            var data = res.body
            var now = (new Date().getTime())
            var expires_in = now + (data.expires_in - 20) * 1000
            data.expires_in = expires_in
            console.log('res.body')
            resolve(data)
        })
    })
}
var app = new koa()
module.exports = (opts) => async function(ctx, next) {
    var wechat = new Wechat(opts)
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
    } else {
        ctx.body = 'wong'
    }
    await next()
}