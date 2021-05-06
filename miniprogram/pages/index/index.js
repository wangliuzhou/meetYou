const app = getApp();
const u = require("../../utils/utils");
const share = require("../../lib/share");
const config = require("../../config");
const membership = require("../../lib/membership");
const Validator = require('../../utils/validator');
const {
  premium,
} = require("../../config");
import {
  watchAuth
} from '../../utils/login'
Page({

  data: {
    new_user: [],
    rec_user: [],
    askingUserCode: '',
    premium: config.premium,
    base: membership.base,
    auth_need: false,
  },
  // 搜索框输入
  input(e) {
    this.setData({
      askingUserCode: e.detail.value
    })
  },
  closeAuth() {
    this.setData({
      auth_need: false
    })
  },
  // 搜索
  search() {
    let searchCode = this.data.askingUserCode.toUpperCase()
    let userCode = app.globalData.userCode
    let {
      value
    } = {
      searchCode,
      userCode
    }
    if (!this.validatorInstance.checkData(value)) return
    wx.showLoading({
      title: '正在搜索资料...',
    })
    wx.cloud.callFunction({
      name: 'searchUser',
      data: {
        searchCode,
        userCode,
      }
    }).then(res => {
      let code = res.result.code
      if (code == 1) {
        wx.showToast({
          title: '查询成功！',
          icon: 'none',
          duration: 2500
        })
        wx.navigateTo({
          url: '/pages/p_detail/p_detail?searchCode=' + searchCode,
        })
      } else if (code == 2) {
        wx.showToast({
          title: '无此用户',
          icon: 'none',
          duration: 2500
        })
      } else if (code == 3) {
        wx.showToast({
          title: '用户存在异常',
          icon: 'none',
          duration: 2500
        })
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '信息提交失败！',
        icon: 'none',
        duration: 2000
      })
    })


  },

  onLoad: function (options) {
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      var from = options.scene.from
    }
    wx.cloud.callFunction({
      name: "getCrowd",
    }).then(res => {
      let rec_user = res.result.rec_user
      this.setData({
        new_user: res.result.new_user,
        rec_user,
      })
    }).catch(err => {
      console.log(err)
    })
    // 这里是监测是否会员部分
    watchAuth().then(e => {
      if (app.auth_status == 1) {
        this.setData({
          auth_need: true
        })
      }
    })
  },

  onReady: function () {
    this.initValidator()
  },
  initValidator() {
    this.validatorInstance = new Validator({
      rules: {
        userCode: {
          required: true
        },
        searchCode: {
          required: true,
          length: 5
        },
      },
      messages: {
        userCode: {
          required: '状态异常，请重新登录后搜索'
        },
        searchCode: {
          required: '会员号不能为空',
          length: '会员好长度为5'
        },

      },
    })
  },

  onShow: function () {

  },

  onShareAppMessage(e) {
    // var t = e.target.dataset.xindex, p = a.target.dataset.yindex, q = this.data.dynamics[t][e];
    // 照片是本人照片。如果没就不传，
    // title是签名，如果没有，调用share.getoneline(),
    // path传参数
    return {
      title: share.getoneline(),
      // path:"pages/index/index?scene=12$" + +i.userCode,
      // imageUrl: q.imgs.length > 0 ? q.imgs[0].imgurl : ""
    };
  },
  onShareTimeline() {
    return {
      title: '遇见,一个让你心动的我',
      query: "这是携带的参数"
    }
  },
})