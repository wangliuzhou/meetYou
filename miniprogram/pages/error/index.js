var app = getApp();
Page({
    data: {
        error: ''
    },

    onLoad: function (n) {
        this.setData({
            error: n.err
        })
    },

    onReady: function () {},
    onShow: function () { },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
   });