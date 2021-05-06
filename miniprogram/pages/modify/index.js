function i(i, e, n) {
  return e in i ? Object.defineProperty(i, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : i[e] = n, i;
}
var app = getApp()
var membership = require('../../lib/membership');
const Validator = require('../../utils/validator')
Page({
  data: {
    profile: '',
    userCode: '',
    base: membership.base,
    asking: membership.asking,
    choseFamily: false,
    choseTelents: false,
    askingTelents: false,
    gender: 1,
    avatar: {},
    form_base: {
      signature: null,
      name: null,
      sex: null,
      hight_index: null,
      weight_index: null,
      cellphone: null,
      wechat: null,
      contact_info: null,
      sesame_credit: null,
      birthday: null,
      region: ['浙江省', '绍兴市', '越城区'],
      area_index: null,
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
    },
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
      extra_asking: "",

    },
    region: '',
    age: '',
    education: '',
    work_type: '',
  },
  modify: null,
  onLoad: function (options) {

  },
  switchSex(e) {
    this.setData({
     gender: (e.detail.value ? 1 : 0)
    })
  },
  sexChange(e) {
    this.setData({
      ['form_base.sex']: e.detail.value
    })
  },
  //上传照片
  chooseAvantar() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success(res) {
        const path = res.tempFilePaths[0];
        var extension = /\.\w+$/.exec(path)
        const fileContent = wx.getFileSystemManager().readFileSync(path, 'base64');
        that.setData({
          avatar: {
            extension,
            fileContent
          }
        })
      }
    })
  },
  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success(res) {
        const path = res.tempFilePaths[0];
        var extension = /\.\w+$/.exec(path)
        const fileContent = wx.getFileSystemManager().readFileSync(path, 'base64');
        wx.showLoading({
          title: '正在提交...',
        })
        wx.cloud.callFunction({
          name: 'uploadImg',
          data: {
            extension,
            fileContent,
            userCode: that.data.userCode,
            gender: that.data.gender,
            avatar: that.data.avatar,
          }
        }).then(res => {
          console.log(res)
          wx.showToast({
            title: '照片提交成功！',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            profile: res.result.profile_Path
          });
        }).catch(err => {
          console.log(err)
          wx.showToast({
            title: '照片提交失败！',
            icon: 'none',
            duration: 2000
          })
        })
      },
    })
  },
  //创造帐号
  create() {
    wx.cloud.callFunction({
      name: 'create',
    }).then(res => {
      this.setData({
        userCode: res.result.userCode
      })
    }).catch(err => {
      wx.showToast({
        title: '创建用户失败',
        icon: 'none',
        duration: 2000
      })
    })
  },
  // 点确定
  bindPickerChange: function (e) {},
  // 滑动选择时
  bindPickerColumnChange: function (e) {
    var t = this.data.form_asking;
    var o = e.target.dataset.field;
    var n = t[`${o}`]
    n[e.detail.column] = e.detail.value, 0 == e.detail.column ? n[1] < e.detail.value && (n[1] = e.detail.value) : 1 == e.detail.column && n[0] > e.detail.value && (n[0] = e.detail.value),
      this.setData({
        form_asking: t
      });
  },

  // 下面两个都是显示底部选择弹框。
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
  modify_func: function (e) {
    var n = e.currentTarget.dataset.field;
    this.setData(i({}, "form_base." + n, e.detail.value));
  },
  modify_asking: function (e) {
    var n = e.currentTarget.dataset.field;
    this.setData(i({}, "form_asking." + n, e.detail.value));
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
        asking,
        userCode: userCode
      }
    }).then(res => {
      wx.showToast({
        title: '信息提交成功！',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        // age:
        education: this.data.base.education_Arr[base.eduction_index]
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
  initValidator() {
    this.validatorInstance = new Validator({
      rules: {
        signature: {
          required: true
        },
        name: {
          required: true
        },
        sex: {
          required: true
        },
        hight_index: {
          required: true
        },
        weight_index: {
          required: true
        },
        cellphone: {
          required: true,
          mobile: true
        },
        wechat: {
          required: true,
        },
        sesameCredit: {
          range: [350, 950]
        },
        birthday: {
          required: true,
        },
        location_index: {
          required: true,
        },
        eduction_index: {
          required: true,
        },
        work_type_index: {
          required: true,
        },
        real_estate_index: {
          required: true,
        },
        marry_index: {
          required: true,
        },

      },
      messages: {
        signature: {
          required: '请填写个性签名'
        },
        sex: {
          required: '性别要选一下'
        },
        name: {
          required: '请输入用户名'
        },
        cellphone: {
          required: '请输入手机号',
          mobile: '手机号格式不正确'
        },
        wechat: {
          required: '请输入微信号',
        },
        sesameCredit: {
          range: '请填入正确的芝麻信用分',
        },
        birthday: {
          required: '请选择生日',
        },
        location_index: {
          required: '请选择所在地区',
        },
        eduction_index: {
          required: '请选择您的学历',
        },
        work_type_index: {
          required: '请选择您的工作',
        },
        real_estate_index: {
          required: '请选择您的房产信息',
        },
        marry_index: {
          required: '请选择婚姻状况',
        },
      },
    })
  },

  onReady: function () {
    this.initValidator()
  },

  onShow: function () {},

  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {}
})