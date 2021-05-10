var config = require("./config");
App({
  onLaunch: function(options) {
    if (!wx.cloud) {
      config.errHandle("请使用更高版本微信");
    } else {
      wx.cloud.init({
        env: "manage-6ga290rpb99a0dbd",
        traceUser: true
      });
    }
    // wx.cloud.callFunction({
    //     name: "demo",
    //   }).then(res => {
    //     console.log(res.result)
    //   }).catch(err => {
    //     console.log(err)
    //   }),
    this.login();
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar =
            capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    });
  },
  auth_status: 4,
  // auth_status:1是不存在，2是有，3是出问题。4是等待
  temp: {},
  globalData: {
    wxUserInfo: null,
    userInfo: null,
    systemInfo: null,
    userCode: "",
    Custom: null,
    CustomBar: null,
    StatusBar: null
  },

  hasUserInfo: function() {
    if (this.globalData.userInfo) {
      return true;
    }
    return false;
  },
  login() {
    var that = this;
    wx.cloud
      .callFunction({
        name: "login"
      })
      .then(res => {
        (that.auth_status = res.result.code),
          (that.globalData.systemInfo = res.result.systemInfo);
        if (res.result.code == 2) {
          that.globalData.userInfo = res.result.userInfo;
          that.globalData.wxUserInfo = res.result.userInfo.wxUserInfo;
          that.globalData.userCode = res.result.userInfo.userCode;
        }
      })
      .catch(err => {
        that.auth_status = 3;
        config.errHandle("服务器连接故障");
      });
  }
});
