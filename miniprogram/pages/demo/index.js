var app = getApp()
Page({
  data: {
    jieguo: '',
    
  },
  onLoad: function (options) {

  },

  onReady: function () {
    this.setData({
      jieguo: 12 + '23' + 15
    })
  },

  onShow: function () {
    console.log(typeof (this.data.jieguo))
  },

  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {}
})