var app = getApp()
var config = require('../../config')
const u = require('../../utils/utils')

Page({
  data: {
    videoUrl: "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200ff20000bqmg8e8a2pet75tpief0&ratio=720p&line=0",
    actvitys: "",
    systemInfo:'',
  },

  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'getAct',
    }).then(res => {
      this.setData({
        actvitys: res.result.act
      })
    }).catch(err => {
      console.log(err)
    })
  },
  go_pass() {
    wx.navigateTo({
      url: '/pages/act_pass/index',
    })
  },
  go_random() {
    wx.navigateTo({
      url: '/pages/random_act/index',
    })
  },
  go_detail(e) {
    let act = e.currentTarget.dataset.act
    app.temp=act
    wx.navigateTo({
      url: '/pages/act_detail/index',
    })
  },

  onReady: function () {

  },

  onShow: function () {
   this.setData({
    systemInfo:app.globalData.systemInfo
   })
  },

  onHide: function () {},

  onUnload: function () {

  },

  onPullDownRefresh: function () {},

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },
  cardSwiper() {

  }
})