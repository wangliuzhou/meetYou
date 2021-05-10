var app = getApp();
var config = require("../../config");
import { shareAct, onUserOpenApp } from "./../../utils/share";

Page({
  data: {
    random: "",
    boys_set_num: 10,
    boys_set_num: 10,
    boys: 7,
    girls: 5,
    random_finish_person: 5400,
    random_finish_num: 210,
    discount: "",
    show_path: false
  },

  onLoad: function(options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene);
    wx.cloud
      .callFunction({
        name: "getRandom"
      })
      .then(res => {
        this.setData({
          random: res.result,
          discount:
            Math.round((res.result.real_cost * 100) / res.result.cost) / 10
        });
      })
      .catch(err => {
        config.errHandle(err);
      });
    onUserOpenApp(options);
  },

  showRule() {
    this.setData({
      show_rule: !this.data.show_rule
    });
  },
  showPath() {
    this.setData({
      show_path: !this.data.show_path
    });
  },
  onReady: function() {},

  onShow: function() {},

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {},

  onReachBottom: function() {},

  onShareAppMessage: function() {
    return shareAct("/pages/random_act/index");
  }
});
