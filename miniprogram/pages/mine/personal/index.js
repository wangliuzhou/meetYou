import { shareMyCard } from "../../../utils/share";

function i(i, e, n) {
  return (
    e in i
      ? Object.defineProperty(i, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        })
      : (i[e] = n),
    i
  );
}
var app = getApp();
Page({
  data: {
    userCode: "XMV76",
    searchAble: true,
    showMe: true,
    signature: "",
    introducer: ""
  },
  onLoad: function(options) {},
  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original"],
      sourceType: ["album", "camera"],
      success(res) {
        const path = res.tempFilePaths[0];
        var extension = /\.\w+$/.exec(path);
        const fileContent = wx
          .getFileSystemManager()
          .readFileSync(path, "base64");
        wx.showLoading({
          title: "正在提交..."
        });
        wx.cloud
          .callFunction({
            name: "uploadImg",
            data: {
              extension,
              fileContent,
              userCode: that.data.userCode
            }
          })
          .then(res => {
            console.log(res);
            wx.showToast({
              title: "照片提交成功！",
              icon: "none",
              duration: 2000
            });
            that.setData({
              profile: res.result.fileID
            });
          })
          .catch(err => {
            console.log(err);
            wx.showToast({
              title: "照片提交失败！",
              icon: "none",
              duration: 2000
            });
          });
      }
    });
  },
  input(e) {
    var t = e.currentTarget.dataset.field;
    this.setData(i({}, t, e.detail.value));
  },
  shareMyCard,

  onReady: function() {},

  onShow: function() {},

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {},

  onReachBottom: function() {},

  onShareAppMessage: function() {}
});
