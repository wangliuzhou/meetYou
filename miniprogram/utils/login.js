var config = require('../config')
export const getSystemSetting = () => {
  return new Promise((resolve, reject) => {
    wx.call({
      success: (res) => {
        resolve(res.authSetting);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: (res) => {
        let userInfo = JSON.parse(res.rawData)
        resolve(userInfo);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err);
      }
    });

  })
}
export const initUserInfo = () => {
  let wxUserInfo = wx.getStorage('wxUserInfo');
  if (wxUserInfo) {
    this.globalData.wxUserInfo = wxUserInfo;
  }
}

export const watchAuth = () => {
  return new Promise((resolve, reject) => {
    var time = 0
    var loop = setInterval((function () {
      // auth_status:1是不存在，2是有，3是出问题。4是等待
      if (getApp().auth_status == 1 || getApp().auth_status == 2) {
        wx.hideToast({
          success: (res) => {},
        })
        clearInterval(loop)
      } else if (getApp().auth_status == 4) {
        wx.showToast({
          title: '重连中...',
          icon: 'error',
          duration: 1000,
          mask: true
        })
      } else if (getApp().auth_status == 3) {
        clearInterval(loop)
      }
      time++
      if (time == 5) {
        clearInterval(loop)
        config.errHandle('服务器连接故障!')
      }
    }), 1200)
  })
}