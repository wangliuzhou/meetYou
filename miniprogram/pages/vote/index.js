function i(i, e, n) {
  return e in i ? Object.defineProperty(i, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : i[e] = n, i;
}
var app = getApp()
var vote = require('../../lib/vote');
Page({
  data: {
    title: "",
    vote: [],
    education: vote.education,
    work: vote.work,
    marry: vote.marry,
    age: vote.age,
    answer_person: {},
    result: [],
    alphabet: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N"]
  },
  onLoad: function (options) {
  wx.cloud.callFunction({
        name: "vote",
      }).then(res => {
         this.setData({         
          title:res.result.title,
          vote:res.result.questions
        })
      }).catch(err => {
        console.log(err)
      })
  },
  sexChange(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  modify_func: function (e) {
    var n = e.currentTarget.dataset.field;
    this.setData(i({}, "answer_person." + n, e.detail.value));
  },
  onReady: function () {},

  onShow: function () {

  },
  resultChange(e) {
    var q_index = Number(e.currentTarget.id)
    var a_index = Number(e.detail.value)
    this.setData({
      ['result[' + q_index + ']']:a_index
    })
  },
  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {}
})