var app = getApp()
var config = require('../../config.js');
var u = require('../../utils/utils');
Page({
  data: {
    userInfo: '',
    form_base: '',
    base: config.base,
    bg_certificate:"../../images/checked.png"
  },
  onLoad: function (options) {
    let searchCode = options.searchCode
    wx.cloud.callFunction({
      name: 'getUser',
      data: {
        searchCode,
      }
    }).then(res => {
      let userInfo = res.result.userInfo
      let base = res.result.base
      let time = new Date(base.birthday)
      this.setData({
        userInfo: userInfo,
        form_base: base,
        age: time.getTime()
      })

    }).catch(err => {
      console.log(err)

    })

  },

  onReady: function () {},

  onShow: function () {},

  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {}
})