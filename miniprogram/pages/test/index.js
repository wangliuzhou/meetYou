var app = getApp()
var test=require('../../lib/16pf')
Page({
  data: {
    index: 0,
    Q: '',
    workTime: '',
    animation: '',
  },
  seconds: 0,
  arr: [],
  onLoad: function (options) {
    this.setData({
      Q: test.question_bank[this.data.index],
    })
    let that = this
    setInterval(function () {
      that.seconds = ++that.seconds
      that.showTimeIncrease(that.seconds)
      that.toggle()
    }, 1000)
  },
  toggle() {
    var anmiaton = 'shake';
    var that = this;
    that.setData({
      animation: anmiaton
    })
    setTimeout(function () {
      that.setData({
        animation: ''
      })
    }, 200)
  },
  showTimeIncrease(e) { //正计时
    var that = this
    var hour = parseInt(e / 60 / 60);
    var minute = parseInt(e / 60 % 60);
    var second = parseInt(e % 60);
    var time = that.tofixTime(hour) + ":" + that.tofixTime(minute) + ":" + that.tofixTime(second);
    that.setData({
      workTime: time
    })
  },
  // 把时间化为可以正确显示的格式，特别是加上0
  tofixTime(num) {
    if (num < 10) {
      return '0' + num;
    } else {
      return '' + num;
    }
  },
  // 自动转到下一题
  next: function (e) {
    let v = e.currentTarget.dataset.value
    let that=this
    that.arr.push(v)
    let len = test.question_bank.length-1
    if (this.data.index >= len) {
    
       // 直接处理数组
     //直接跳转到结果页面。
         }
        
    this.setData({
      index: ++this.data.index,
      Q: test.question_bank[this.data.index],
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