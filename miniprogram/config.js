// 这是全局配置文件
module.exports = {
  //错误处理
  errHandle: function (err) {
    wx.hideToast({
      success: (res) => {
        wx.showToast({
          title: '出现了错误！',
          mask: true,
          duration: 1000,
          icon: 'none'
        })
      },
    })
    wx.reLaunch({
      url: '/pages/error/index?err=' + err
    })
  },
  // 这里放的变量都是不可改变的，
  common_staticurl: '/images/custom',
  kefu_qrcode_url:'cloud://manage-6ga290rpb99a0dbd.6d61-manage-6ga290rpb99a0dbd-1305283125/system/staff1.jpg',
  kefu_num:'13757574577',
  // 这个数据以后服务器获取。暂时写死
  premium: [{
    name:"普通",
    color:"gray"
  },{
    name:"精选",
    color:"blue"
  },{
    name:"星标",
    color:"yellow"
  }]
}

// 最新会员那里没有more、了，推荐单身那里，没有more，加入推荐
// 如果该人上传了照片，就用照片，就变成了推荐，
// 后期改成付出一元钱，就变成推荐，如果没有上传照片，照片设置为空照片（是一个背影的人