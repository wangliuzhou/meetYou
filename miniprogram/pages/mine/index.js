const app = getApp();
Page({
  data: {
    wxUserInfo:'',
    hasUserInfo: false,
    showModal:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    baseArr: [11, 22, 33, 44, 55, 66],
    zeouArr: ['要高','要有钱','还要帅','听话'],
    is_Auth:true
  },
  onLoad: function (options) {},

  attached() {
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();

    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 30)
      } else {
        that.setData({
          starCount: that.coutNum(3000),
          forksCount: that.coutNum(484),
          visitTotal: that.coutNum(24000)
        })
      }
    }
    wx.hideLoading()
  },
  coutNum(e) {
    if (e > 1000 && e < 10000) {
      e = (e / 1000).toFixed(1) + 'k'
    }
    if (e > 10000) {
      e = (e / 10000).toFixed(1) + 'W'
    }
    return e
  },

 
  goPage(e) {
    var t = e.currentTarget.dataset.page;
    this.data.is_Auth ? wx.navigateTo({
      //到时改为全局变量
      url: `/pages/${t}/index`,
    }) : wx.showModal({
      title: "授权提醒",
      content: "您还未授权，请授权后继续",
      confirmText: "去授权",
      confirmColor: "#fe3ea5",
      success: function (o) {
        o.confirm && that.setData({
          showModal:true
        })
      }
    });
    wx.navigateTo({
      url: `/pages/${t}/index`,
    })
  },
  
  onReady: function () {},

  onShow: function () {
    this.attached(),
    this.setData({
      wxUserInfo:app.globalData.wxUserInfo
    })
  },

  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {  },

  onShareAppMessage: function () {}
})