'use strict'
var koa = require('koa')
const xmlParser = require('koa-xml-body')
var sha1 = require('sha1')
var path = require('path')
var util = require('./libs/util')
var wechat = require('./wechat/g')
var wechat_file = path.join(__dirname, './config/wechat.txt')
var config = {
    wechat: {
        appID: 'wx4c10dcbc112ceaeb',
        appSecret: '6f802e7cef82c74596b9760e3b31f4ff',
        token: 'd027us7DzEzod7So0ddTE27KZyEUZoFo',
        getAccessToken: function() {
            return util.readFileAsync(wechat_file, 'utf8')
        },
        saveAccessToken: function(data) {
            return util.writeFileAsync(wechat_file, data)
        }

    }
}
var app = new koa()

app.use(xmlParser())
app.use(wechat(config.wechat))
app.listen(1234)
console.log('listening:1234')