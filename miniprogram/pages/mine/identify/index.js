var app = getApp()
Page({
  data: {
    idFront:'',//身份证正面
    idBack:'',//身份证反面
    mainPic:'',//主图
    realName:'',//姓名
    ID:'',//身份证号
    form:{shiming_shenfen_up:'',shiming_shenfen_back:''}
  },
  // 从服务器读取，如果有，把上传按钮设置为disable，如果没有，设置为空。如果为空则不能上传
  onLoad: function (options) {

  },
  // 换照片
  changeImg() {
    let that = this;
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,//云存储图片名字
          filePath,//临时路径
          success: res => {
            console.log('[上传图片] 成功：', res)
            that.setData({
              e: res.fileID,//云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
            });
            let fileID = res.fileID;
            //把图片存到users集合表
            const db = wx.cloud.database();
              db.collection("users").add({
                data: {
                  bigImg: fileID
                },
                success: function () {
                  wx.showToast({
                    title: '图片存储成功',
                    'icon': 'none',
                    duration: 3000
                  })
                },
                fail: function () {
                  wx.showToast({
                    title: '图片存储失败',
                    'icon': 'none',
                    duration: 3000
                  })
                }
              }); 
          },
           fail: e => {
            console.error('[上传图片] 失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  },

  onReady: function () {},

  onShow: function () {},

  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {}
})