var app = getApp();
var config = require("../../config");
import { shareAct, onUserOpenApp } from "./../../utils/share";

Page({
  data: {
    show_detail: false,
    show_rule: false,
    show_path: false,
    // return_rate: 70,
    act: "",
    discount: "",
    comment: "", // 评论,
    orderInfo: {}
  },

  onLoad: function(options) {
    onUserOpenApp(options);
    this.getOpenId();
  },
  async getOpenId() {
    const { result } = await wx.cloud.callFunction({
      name: "utils",
      data: {
        type: "getOpenid"
      }
    });
    this.openid = result;
    let comments = [];
    app.temp.comments.forEach(commnet => {
      if (commnet.openid == result) {
        comments.push(commnet);
      }
    });
    app.temp.comments = comments;
    this.setData({
      act: app.temp,
      discount: Math.round((app.temp.real_cost * 100) / app.temp.cost) / 10
    });
    this.getOrderInfo();
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
  // 查询用户是否报名过
  async getOrderInfo() {
    const { result } = await wx.cloud.callFunction({
      name: "order",
      data: {
        type: "getOrderInfo",
        sn: this.data.act.sn
      }
    });

    if (result.data && result.data[0]) {
      this.setData({
        orderInfo: result.data[0]
      });
    }
  },
  // 点击我要报名按钮
  signIn() {
    if (this.data.orderInfo.status === 1) {
      console.log("去退款");
      // 去退款
      wx.showModal({
        title: "提示",
        content: "确认要退款吗",
        success: result => {
          if (result.confirm) {
            this.refundOrder();
          }
        }
      });

      return;
    }
    // 去报名
    this.unifiedOrder();
  },
  // 去报名
  unifiedOrder() {
    const {
      title,
      real_cost,
      sn,
      act_time,
      place,
      return_rate
    } = this.data.act;
    const that = this;
    wx.showLoading({
      title: "支付中...",
      mask: true
    });

    wx.cloud.callFunction({
      name: "wxPay",
      data: {
        type: "unifiedOrder",
        title,
        real_cost,
        sn,
        nikeName: app.globalData.wxUserInfo.nikeName,
        act_time,
        place,
        return_rate,
        gender: app.globalData.wxUserInfo.gender
      },
      success: res => {
        const payment = res.result.payment;
        wx.requestPayment({
          ...payment,
          success(res) {
            that.subscribMessage();
            console.log("pay success", res);
            that.handlePayAfter();
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
  // 支付完成后，需要将openid写入到boys/girls字段中
  async handlePayAfter() {
    // 本地修改
    const sex = app.globalData.wxUserInfo.gender ? "boys" : "girls";
    app.temp[sex].push(this.openid);
    this.setData({ act: app.temp });
    // 更新OrderInfo
    this.getOrderInfo();
  },

  // 让用户订阅消息模板
  subscribMessage() {
    wx.requestSubscribeMessage({
      tmplIds: ["1TYG9Mw5wZuW6wKpOsMOZpI0UnvHQPiXKcD9KiFl7_c"],
      success(res) {}
    });
  },

  // 申请退款
  refundOrder() {
    const { orderInfo } = this.data;
    wx.cloud
      .callFunction({
        name: "wxPay",
        data: {
          type: "refund",
          ...orderInfo
        }
      })
      .then(res => {
        this.handleRefundAfter(res);
      })
      .catch(err => {
        console.log(err);
      });
  },
  handleRefundAfter(res) {
    console.log("申请退款", res);
    if (res.result.code === 0) {
      const { orderInfo } = this.data;
      // 修改本地按钮文字
      orderInfo.status = 2;
      // 修改本地报名人数
      const sex = app.globalData.wxUserInfo.gender ? "boys" : "girls";
      app.temp[sex] = app.temp[sex].filter(openid => openid !== this.openid);
      this.setData({
        orderInfo,
        act: app.temp
      });
      wx.showToast({ title: "退款成功", icon: "none" });
    } else {
      wx.showToast({ title: "退款失败" });
    }
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
          type: "addComments",
          sn: app.temp.sn,
          ...info
        }
      })
      .then(({ result }) => {
        if (result.stats && result.stats.updated === 1) {
          this.suceessSubmitHandle(info);
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

  // 评论提交成功后逻辑处理
  async suceessSubmitHandle(info) {
    wx.showToast({
      title: "提交成功",
      icon: "none"
    });
    app.temp.comments.unshift(info);
    this.setData({ comment: "", act: app.temp });
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
