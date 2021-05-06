var app = getApp()
var membership = require('../../../lib/membership');
const Validator = require('../../../utils/validator')
function i(i, e, n) {
  return e in i ? Object.defineProperty(i, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : i[e] = n, i;
}
Page({
  data: {
    asking: membership.asking,
    askingTelents: false,

    form_asking: {
      marry_index_asking: 0,
      age_index_asking: [0, 0],
      hight_index_asking: [0, 0],
      weight_index_asking: [0, 0],
      education_index_asking: 0,
      reigon_index_asking: 0,
      income_index_asking: 0,
      work_type_index_asking: 0,
      real_estate_index_asking: 0,
      family_member_index_asking: 0,
      telents_asking: membership.telents_Arr,
      habits_asking: '',
      extra_asking: ""
    },
  },
  showModalTelentsAsking() {
    this.setData({
      askingTelents: !this.data.askingTelents
    })
  },
  ChooseCheckbox(e) {
    let n = e.currentTarget.dataset.field1;
    let m = e.currentTarget.dataset.field2;
    let items = this.data[`${n}`][`${m}`];
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData(i({}, n + '.' + m, items));
  },
  modify_asking: function (e) {
    var n = e.currentTarget.dataset.field;
    this.setData(i({}, "form_asking." + n, e.detail.value));
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