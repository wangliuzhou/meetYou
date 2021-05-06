function i(i, e, n) {
  return e in i ? Object.defineProperty(i, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : i[e] = n, i;
}
var app = getApp()
var membership = require('../../../lib/membership');
const Validator = require('../../../utils/validator')
Page({
  data: {
    base: membership.base,
    form_base: {
      name: null,
      sex: null,
      hight_index: null,
      weight_index: null,
      cellphone: null,
      wechat: null,
      contact_info: null,
      sesameCredit: null,
      birthday: null,
      region: ['浙江省', '绍兴市', '越城区'],
      location_index: null,
      eduction_index: null,
      work_type_index: null,
      income: '',
      wealth: '',
      family_wealth: '',
      real_estate_index: null,
      marry_index: null,
      family_member_Arr: membership.family_member_Arr,
      telents_Arr: membership.telents_Arr,
      habits: '',
      Crime: '',
      myPromise: 'false',
      choseFamily:false,
      choseTelents:false
    },

  },
  sexChange(e) {
    this.setData({
      ['form_base.sex']: e.detail.value
    })
  },
  showModalFamily() {
    this.setData({
      choseFamily: !this.data.choseFamily
    })
  },
  showModalTelents() {
    this.setData({
      choseTelents: !this.data.choseTelents
    })
  },
  habitsChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  onLoad: function (options) {


  },
  modify_func: function (e) {
    var n = e.currentTarget.dataset.field;
    this.setData(i({}, "form_base." + n, e.detail.value));
  },
  input(e) {
    var t = e.currentTarget.dataset.field;
    this.setData(i({}, "form_base." + t, e.detail.value));
  },
  toSubmit(e) {
    let base = this.data.form_base;
    let asking = this.data.form_asking;
    let userCode = this.data.userCode
    if (!this.validatorInstance.checkData(base)) return
    // 这里开始提交啦
    wx.showLoading({
      title: '正在提交资料...',
    })
    wx.cloud.callFunction({
      name: 'addInfo',
      data: {
        base,
        userCode: userCode
      }
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '信息提交成功！',
        icon: 'none',
        duration: 2000
      })
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '信息提交失败！',
        icon: 'none',
        duration: 2000
      })
    })
  },
  onReady: function () {

  },
  habitsChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
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