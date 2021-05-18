// 下面是mine index js
var membership = require("../../lib/membership");

const app = getApp();
Page({
  data: {
    wxUserInfo: "",
    hasUserInfo: false,
    showModal: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    baseArr: ["唱歌", "车房"],
    zeouArr: ["要高", "要有钱", "还要帅", "听话"],
    is_Auth: true
  },
  onLoad: function(options) {},

  attached() {
    let that = this;
    wx.showLoading({
      title: "数据加载中",
      mask: true
    });
    let i = 0;
    numDH();

    function numDH() {
      if (i < 20) {
        setTimeout(function() {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          });
          i++;
          numDH();
        }, 30);
      } else {
        that.setData({
          starCount: that.coutNum(3000),
          forksCount: that.coutNum(484),
          visitTotal: that.coutNum(24000)
        });
      }
    }
    wx.hideLoading();
  },
  coutNum(e) {
    if (e > 1000 && e < 10000) {
      e = (e / 1000).toFixed(1) + "k";
    }
    if (e > 10000) {
      e = (e / 10000).toFixed(1) + "W";
    }
    return e;
  },

  goPage(e) {
    var t = e.currentTarget.dataset.page;
    this.data.is_Auth
      ? wx.navigateTo({
          //到时改为全局变量
          url: `/pages/${t}/index`
        })
      : wx.showModal({
          title: "授权提醒",
          content: "您还未授权，请授权后继续",
          confirmText: "去授权",
          confirmColor: "#fe3ea5",
          success: function(o) {
            o.confirm &&
              that.setData({
                showModal: true
              });
          }
        });
    wx.navigateTo({
      url: `/pages/${t}/index`
    });
  },

  async getAskingInfo() {
    const { result } = await wx.cloud.callFunction({
      name: "users",
      data: {
        type: "getUserInfo"
      }
    });
    if (result && result.data && result.data[0]) {
      const { base = {}, asking = {} } = result.data[0];
      const { telents_Arr = [] } = base;
      const telentsName = telents_Arr.map(item => {
        const telents = membership.base.telents_Arr.find(i => i.value == item);
        return telents.name;
      });
      const {
        education_index_asking,
        income_index_asking,
        real_estate_index_asking,
        work_type_index_asking
      } = asking;
      const c = membership.asking;
      const indexArr = [
        education_index_asking,
        income_index_asking,
        real_estate_index_asking,
        work_type_index_asking
      ];
      const vArr = [
        c.education_Arr_asking,
        c.income_Arr_asking,
        c.real_estate_Arr_asking,
        c.work_type_Arr_asking
      ];
      const zeouArr = [];
      indexArr.forEach((item, index) => {
        if (item > 0) {
          zeouArr.push(vArr[index][item]);
        }
      });

      this.setData({
        baseArr: telentsName,
        zeouArr
      });
    }
  },

  onReady: function() {},

  onShow: function() {
    this.attached();
    this.getAskingInfo();
    this.setData({
      wxUserInfo: app.globalData.wxUserInfo
    });
  },

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {},

  onReachBottom: function() {},

  onShareAppMessage: function() {}
});
