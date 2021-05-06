var app = getApp()
Component({
  properties: {
    showModal: {
      type: Boolean,
      value: '',
    },
  },

  data: {

  },
  options: {
    styleIsolation: 'apply-shared'
  },

  ready: function () {
  },

  methods: {
    hideModal() {
      this.setData({
        showModal: false
      })
    },
    onClose() {
      const __this = this;
      wx.showModal({
        title: '请授权',
        content: '授权才能使用程序功能',
        success(res) {
          if (res.confirm) {
            wx.showToast({
              title: '请授权',
              icon: 'success',
              duration: 500
            })
            __this.setData({
              BmodalShow: true
            })
          } else if (res.cancel) {
            wx.showToast({
              title: '请授权',
              icon: 'error',
              duration: 500
            })
            __this.setData({
              BmodalShow: true
            })
          }
        }
      })
    },

    bindGetUserInfo: function (e) {
      if (e.detail.userInfo) {
        //用户按了允许授权按钮
        console.log(e.detail.userInfo)
        var that = this;
        that.setData({
          showModal: false
        });
        app.globalData.isBindUser = true
        this.triggerEvent('comclick',e.detail.userInfo)
      } else {
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法正常使用，请授权',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            // 用户没有授权成功，不需要改变 showModal 的值
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
    }
  },
})