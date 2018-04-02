'use strict'
var koa = require('koa')
var sha1 = require('sha1')
var wechat = require('./wechat/g')
var config = {
    wechat: {
        appID: 'wx4c10dcbc112ceaeb',
        appSecret: '6f802e7cef82c74596b9760e3b31f4ff',
        token: 'd027us7DzEzod7So0ddTE27KZyEUZoFo'
    }
}
var app = new koa()
app.use(wechat(config.wechat))
app.listen(1234)
console.log('listening:1234')