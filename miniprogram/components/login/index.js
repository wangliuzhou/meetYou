var app = getApp()
Component({
  properties: {
  
  },

  data: {

  },
  options: {
    styleIsolation: 'apply-shared'
  },

  ready: function () {

  },

  methods: {
    GetUserInfo(e) {
      let that=this
      wx.getUserProfile({
        desc: '正在获取', 
        success: function (res) {
         let wxUserInfo= res.userInfo
                //点确定了就是成功
         wx.cloud.callFunction({
        name: "createUser",
        data:{
          wxUserInfo
        }
      }).then(r => {
        console.log(r.result)
        app.globalData.wxUserInfo=wxUserInfo,
        app.auth_status=2
      }).catch(err => {
        console.log(err)
      })
// 上传用户，
that.triggerEvent('closeAuth')
// 关闭条子，
// 设置全局变量
        },
        fail: function (err) {
          wx.showToast({
            title: '您点击了取消',
          })
        }
      })
    }
  },

})