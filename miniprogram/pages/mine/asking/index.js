var app = getApp();
var membership = require("../../../lib/membership");
const Validator = require("../../../utils/validator");

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
      telents_asking: [],
      habits_asking: "",
      extra_asking: ""
    }
  },
  showModalTelentsAsking() {
    this.setData({
      askingTelents: !this.data.askingTelents
    });
  },
  chooseCheckbox(e) {
    const { index } = e.currentTarget.dataset;
    const { telents_Arr } = this.data.asking;
    const item = telents_Arr[index];
    item.checked = !item.checked;
    this.setData({
      asking: this.data.asking
    });
  },

  cancelChoose(e) {
    this.data.asking.telents_Arr = JSON.parse(
      JSON.stringify(this.first_telents_Arr)
    );
    this.setData({
      asking: this.data.asking,
      askingTelents: false
    });
  },

  confirmChoose(e) {
    this.first_telents_Arr = JSON.parse(
      JSON.stringify(this.data.asking.telents_Arr)
    );
    this.data.form_asking.telents_asking = this.data.asking.telents_Arr
      .filter(item => item.checked)
      .map(item => item.value);
    this.setData({
      form_asking: this.data.form_asking,
      askingTelents: false
    });
  },
  modify_asking: function(e) {
    var { field } = e.currentTarget.dataset;
    const { form_asking } = this.data;
    form_asking[field] = e.detail.value;
    this.setData({
      form_asking
    });
  },
  onLoad: function(options) {
    this.getAskingInfo();
  },
  async getAskingInfo() {
    wx.showLoading({
      title: "加载中..."
    });
    const { result } = await wx.cloud.callFunction({
      name: "users",
      data: {
        type: "getUserInfo"
      }
    });
    console.log(123, result);

    wx.hideLoading();
    const { telents_Arr } = this.data.asking;
    // 新手数据库未必有asking
    if (!result || !result.data || !result.data[0] || !result.data[0].asking) {
      console.log("telents_Arr", telents_Arr);
      this.first_telents_Arr = JSON.parse(JSON.stringify(telents_Arr));
      return;
    }
    const { asking } = result.data[0];
    console.log(11, asking);
    if (asking.telents_asking) {
      telents_Arr.forEach(i => {
        i.checked = asking.telents_asking.includes(i.value);
      });
      this.first_telents_Arr = JSON.parse(
        JSON.stringify(this.data.asking.telents_Arr)
      );
    }
    this.setData({
      form_asking: asking,
      asking: this.data.asking
    });
  },

  submitForm(e) {
    wx.showLoading({
      title: "正在提交资料..."
    });
    wx.cloud
      .callFunction({
        name: "users",
        data: {
          type: "updateAskingInfo",
          ...this.data.form_asking
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
          }, 1500);
          return;
        }
        wx.showToast({
          title: "信息提交失败！",
          icon: "none"
        });
        console.log(1, res);
      })
      .catch(err => {
        console.log(2, rr);
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
  familyChange(e) {
    this.setData({
      indexFamily: e.detail.value
    });
  },
  XlChange(e) {
    this.setData({
      indexXl: e.detail.value
    });
  },
  SrChange(e) {
    this.setData({
      indexSr: e.detail.value
    });
  },
  // 获取定位
  getLoction() {
    wx.getLocation({
      type: "wgs84", //wgs84
      success: res => {
        var lat = res.latitude;
        var lng = res.longitude;
        console.log(lat + "||latitude");
        console.log(lng + "||longitude");
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
