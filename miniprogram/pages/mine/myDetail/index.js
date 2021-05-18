function i(obj, key, value) {
  obj[key] = value;
  return obj;
}
var app = getApp();
var membership = require("../../../lib/membership");
const Validator = require("../../../utils/validator");
Page({
  data: {
    base: membership.base,
    form: {
      name: null,
      sex: null,
      cellphone: null,
      wechat: null,
      contact_info: null,
      sesameCredit: null,
      birthday: null,
      hight_index: null,
      weight_index: null,
      region: ["浙江省", "绍兴市", "越城区"],
      location: ["浙江省", "绍兴市", "越城区"],
      eduction_index: null,
      work_type_index: null,
      income: "",
      wealth: "",
      family_wealth: "",
      real_estate_index: null,
      marry_index: null,
      family_member_Arr: [],
      telents_Arr: [],
      habits: [],
      crime: "",
      myPromise: false,
      choseFamily: false,
      choseTelents: false
    }
  },
  showModalFamily() {
    this.setData({
      choseFamily: !this.data.choseFamily
    });
  },
  showModalTelents() {
    this.setData({
      choseTelents: !this.data.choseTelents
    });
  },
  habitsChange: function(e) {
    const value = e.detail.value.map(i => parseInt(i));
    console.log(value);
    const form = i(this.data.form, "habits", value);
    this.data.base.habits_Arr.forEach(item => {
      item.checked = value.includes(item.value);
    });
    this.setData({
      base: this.data.base,
      form
    });
    console.log(this.data.form);
  },
  chooseCheckbox(e) {
    const { cancelChooseType, index } = e.currentTarget.dataset;
    const key = ["family_member", "telents"][cancelChooseType];
    const arr = this.data.base[key + "_Arr"];
    const item = arr[index];
    item.checked = !item.checked;
    this.data.base[key + "_Arr"][index] = item;
    this.setData({
      base: this.data.base
    });
  },

  cancelChoose(e) {
    const { cancelChooseType } = e.currentTarget.dataset;
    const key = ["family_member_Arr", "telents_Arr"][cancelChooseType];
    this.data.base[key] = JSON.parse(JSON.stringify(this["temp_" + key]));
    this.setData({
      base: this.data.base,
      choseFamily: false,
      choseTelents: false
    });
  },

  confirmChoose(e) {
    const { cancelChooseType } = e.currentTarget.dataset;
    const key = ["family_member_Arr", "telents_Arr"][cancelChooseType];
    this["temp_" + key] = JSON.parse(JSON.stringify(this.data.base[key]));
    this.data.form[key] = this.data.base[key]
      .filter(item => item.checked)
      .map(item => item.value);
    this.setData({
      base: this.data.base,
      form: this.data.form,
      choseFamily: false,
      choseTelents: false
    });
  },

  onLoad: function(options) {
    this.getBaseInfo();
  },
  async getBaseInfo() {
    wx.showLoading({
      title: "加载中..."
    });
    const { result } = await wx.cloud.callFunction({
      name: "users",
      data: {
        type: "getUserInfo"
      }
    });
    wx.hideLoading();
    const { family_member_Arr, telents_Arr, habits_Arr } = this.data.base;
    // 新手数据库未必有base
    if (!result || !result.data || !result.data[0] || !result.data[0].base) {
      this.temp_family_member_Arr = JSON.parse(
        JSON.stringify(family_member_Arr)
      );
      this.temp_telents_Arr = JSON.parse(JSON.stringify(telents_Arr));
      return;
    }
    const { base } = result.data[0];
    console.log(11, base);
    base.myPromise = false;
    [family_member_Arr, telents_Arr, habits_Arr].forEach((item, index) => {
      item.forEach(i => {
        i.checked = [base.family_member_Arr, base.telents_Arr, base.habits][
          index
        ].includes(i.value);
      });
    });
    if (base.family_member_Arr) {
      this.temp_family_member_Arr = JSON.parse(
        JSON.stringify(this.data.base.family_member_Arr)
      );
    }
    if (base.telents_Arr) {
      this.temp_telents_Arr = JSON.parse(
        JSON.stringify(this.data.base.telents_Arr)
      );
    }

    this.setData({
      form: base,
      base: this.data.base
    });
  },

  modify_func: function(e) {
    var { field } = e.currentTarget.dataset;
    let { value } = e.detail;
    if (typeof value === "string") {
      value = value.trim();
    }
    this.setData({ form: i(this.data.form, field, value) });
  },
  toogleMyPromise() {
    this.data.form.myPromise = !this.data.form.myPromise;
    this.setData({ form: this.data.form });
  },
  submitForm(e) {
    const { form } = this.data;
    if (!form.myPromise) {
      wx.showToast({
        title: "请勾选承诺"
      });
      return;
    }
    // 这里开始提交啦
    wx.showLoading({
      title: "正在提交资料..."
    });
    wx.cloud
      .callFunction({
        name: "users",
        data: {
          type: "updateBaseInfo",
          ...form
        }
      })
      .then(res => {
        if (res.result && res.result.stats) {
          wx.showToast({
            title: "信息提交成功！",
            icon: "none"
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 2000);
          return;
        }
        wx.showToast({
          title: "信息提交失败！",
          icon: "none"
        });
        console.log(res);
      })
      .catch(err => {
        console.log(err);

        wx.showToast({
          title: "信息提交失败！",
          icon: "none"
        });
      });
  },
  onReady: function() {},

  onShow: function() {},

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {},

  onReachBottom: function() {},

  onShareAppMessage: function() {},

  // 获取定位
  getLoction() {
    wx.getLocation({
      type: "wgs84", //wgs84
      success: res => {
        var lat = res.latitude;
        var lng = res.longitude;
        // wgs84转百度坐标系
        var ssws = that.wgs84togcj02(lng, lat);
        ssws = that.gcj02tobd09(ssws[0], ssws[1]);
        //解决定位偏移
        var ssssss1 = ssws[1] - 0.00016;
        var ssssss2 = ssws[0] - 0.00016;
        that.setData({
          latitude: ssssss1.toFixed(6),
          longitude: ssssss2.toFixed(6)
        });
        that.setData({
          jd: ssssss2.toFixed(6),
          wd: ssssss1.toFixed(6)
        });
      }
    });
  }
});
