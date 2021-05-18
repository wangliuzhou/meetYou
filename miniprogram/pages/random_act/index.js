// 随机活动js
var app = getApp();
var config = require("../../config");
import { shareAct, onUserOpenApp } from "./../../utils/share";

Page({
  data: {
    random: {},
    discount: "",
    show_path: false,
    comment: ""
  },

  onLoad: function(options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene);
    this.getInfo();
    onUserOpenApp(options);
  },
  getInfo() {
    wx.showLoading({
      title: "加载中..."
    });
    wx.cloud
      .callFunction({
        name: "getRandom"
      })
      .then(res => {
        res.result.comments.forEach(item => {
          item.createTime = format(item.createTime);
        });
        this.setData({
          random: res.result,
          discount:
            Math.round((res.result.real_cost * 100) / res.result.cost) / 10
        });
        console.log(111, this.data);
        wx.hideLoading();
      })
      .catch(err => {
        wx.hideLoading();
        config.errHandle(err);
      });
  },
  // 去报名
  signIn() {
    const that = this;
    wx.showLoading({
      title: "支付中...",
      mask: true
    });
    console.log("real_cost", this.data.random.real_cost);

    wx.cloud.callFunction({
      name: "wxPay",
      data: {
        type: "randomActivity",
        real_cost: that.data.random.real_cost,
        nikeName: app.globalData.wxUserInfo.nikeName,
        gender: app.globalData.wxUserInfo.gender
      },
      success: res => {
        console.log(77, res);

        const payment = res.result.payment;
        wx.requestPayment({
          ...payment,
          success(res) {
            that.subscribMessage();
            console.log("pay success", res);
            that.getInfo();
          },
          fail(err) {
            console.error("pay fail", err);
          }
        });
      },
      fail: console.error,
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  // 让用户订阅消息模板
  subscribMessage() {
    wx.requestSubscribeMessage({
      tmplIds: ["1TYG9Mw5wZuW6wKpOsMOZpI0UnvHQPiXKcD9KiFl7_c"]
    });
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
  // 输入评论活动内容
  textareaAInput(e) {
    this.setData({ comment: e.detail.value.trim() });
  },
  // 提交评论
  submitComment() {
    const { wxUserInfo } = app.globalData;
    if (!wxUserInfo) return; // 需要去登录  TODU
    const { avatarUrl, nikeName } = wxUserInfo;
    const info = {
      avatarUrl,
      nikeName,
      comment: this.data.comment,
      createTime: +new Date()
    };
    wx.cloud
      .callFunction({
        name: "activity",
        data: {
          type: "addRandomComments",
          ...info
        }
      })
      .then(({ result }) => {
        if (result.stats && result.stats.updated === 1) {
          console.log(2223366);
          this.getInfo();
          this.setData({ comment: "" });
        } else {
          wx.showToast({
            title: "提交失败，请重试",
            icon: "none"
          });
        }
      })
      .catch(err => {
        wx.showToast({
          title: "提交失败，请重试",
          icon: "none"
        });
        console.log(err);
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
function add0(m) {
  return m < 10 ? "0" + m : m;
}
function format(timestamp) {
  var time = new Date(timestamp);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
}
