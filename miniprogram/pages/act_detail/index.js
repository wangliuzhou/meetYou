var app = getApp();
var config = require("../../config");
import { shareAct, onUserOpenApp } from "./../../utils/share";

Page({
  data: {
    show_detail: false,
    show_rule: false,
    show_path: false,
    return_rate: 70,
    act: "",
    discount: ""
  },

  onLoad: function(options) {
    onUserOpenApp(options);
    this.setData({
      act: app.temp,
      discount: Math.round((app.temp.real_cost * 100) / app.temp.cost) / 10
    });
    // if (success) {
    //   this.setData({
    //     act,
    //   })
    // } else {
    //   config.errHandle("案例错误，请返回主页重新开始")
    // }
  },
  showRule() {
    this.setData({
      show_rule: !this.data.show_rule
    });
  },
  showDetail() {
    this.setData({
      show_detail: !this.data.show_detail
    });
  },
  showPath() {
    this.setData({
      show_path: !this.data.show_path
    });
  },
  onReady: function() {},

  onShow: function() {
    var obj = wx.getLaunchOptionsSync();
    console.log(obj);
  },

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {},

  onReachBottom: function() {},

  onShareAppMessage: async function(options) {
    return shareAct("/pages/act_detail/index");
  }
});
