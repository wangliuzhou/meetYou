var n = getApp();
var s = require('../../lib/love_talk')
Page({
    data: {
        sentence:''
    },

    onLoad: function (n) {

    },

    onReady: function () {},
    onShow: function () {
        this.setData({
            sentence: s.getoneline()
        })
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
});