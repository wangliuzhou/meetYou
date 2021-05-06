Page({
  // 填表完整度权重，详细资料每项3，财务状况每项5，另一半每项2
  data: {
    date: '2018-12-25',
    region: ['浙江省', '杭州市', '西湖区'],
    family: ['10W-100W', '101W-200W', '201W-500W', '501W-1000W', '1001W-2000W', '2001W-5000W', '5001W-10000W', '多于10000W'],
    Sr: ['1W-5W', '6W-10W', '11W-20W', '21W-30W', '31W-50W', '51W-100W', '大于100W'],
    Xl: ['初中及以下', '高中', '大专', '本科', '研究生', '博士'],
    indexXl: 0,
    indexFamily: 0,
    indexSr: 0,
    imgCode: '',
    showM: false,

    x: 0,
    area_width: 85, //可滑动区域的宽，单位是百分比，设置好后自动居中
    box_width: 100, //滑块的宽,单位是 rpx
    maxNum: 0,
  },

  drag(e) {
    var that = this;
    this.setData({
      x: e.detail.x
    });
  },
  dragOver(e) {
    var coord = this.data.x;
    var that = this;
    if (coord >= that.data.maxNum) {

      wx.showToast({
        title: '验证成功',
        icon: 'success',
        duration: 1000
      })
      //验证成功之后的代码
    } else {
      that.setData({
        x: 0,
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var n = Math.floor(res.windowWidth * that.data.area_width / 100 - that.data.box_width / 2)
        // 这段可以直接调用全局变量
        that.setData({
          maxNum: n,
        })
      }
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },
  familyChange(e) {
    this.setData({
      indexFamily: e.detail.value
    })
  },
  XlChange(e) {
    this.setData({
      indexXl: e.detail.value
    })
  },
  SrChange(e) {
    this.setData({
      indexSr: e.detail.value
    })
  },
  // 获取定位
  getLoction() {
    wx.getLocation({
      type: 'wgs84', //wgs84
      success: (res) => {
        var lat = res.latitude
        var lng = res.longitude
        console.log(lat + "||latitude");
        console.log(lng + "||longitude");
        // wgs84转百度坐标系
        var ssws = that.wgs84togcj02(lng, lat)
        ssws = that.gcj02tobd09(ssws[0], ssws[1])
        //解决定位偏移
        var ssssss1 = ssws[1] - 0.000160
        var ssssss2 = ssws[0] - 0.000160
        that.setData({
          latitude: ssssss1.toFixed(6),
          longitude: ssssss2.toFixed(6)
        })
        that.setData({
          jd: ssssss2.toFixed(6),
          wd: ssssss1.toFixed(6)
        })
      }
    })
  }
})