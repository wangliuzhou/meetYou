var app = getApp();
Page({
  data: {
    identiFront: "", //身份证正面
    identiBack: "", //身份证反面
    identiName: "", //姓名
    identiId: "", //身份证号
    identi: 0 // 用户认证状态
  },
  // 从服务器读取，如果有，把上传按钮设置为disable，如果没有，设置为空。如果为空则不能上传
  onLoad: function(options) {
    this.getUserInfo();
  },
  // 获取用户信息
  async getUserInfo() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    const { result } = await wx.cloud.callFunction({
      name: "users",
      data: {
        type: "getUserInfo"
      }
    });
    const userInfo = result.data[0];
    if (userInfo) {
      const {
        identiFront,
        identiBack,
        identiName,
        identiId,
        identi
      } = userInfo;
      this.setData({ identiFront, identiBack, identiName, identiId, identi });
    }
    wx.hideLoading();
  },
  // 姓名输入
  identiNameInput(e) {
    this.setData({ identiName: e.detail.value.trim() });
  },
  // 身份证号码输入
  identiIdInput(e) {
    this.setData({ identiId: e.detail.value.trim() });
  },
  // 选择身份证正反面
  chooseImage(e) {
    const { isFront } = e.currentTarget.dataset;
    const tempName = isFront ? "identiFront" : "identiBack";
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          [tempName]: tempFilePath
        });
        // 用户进入页面后，有重新选择了图片
        this[tempName] = true;
      }
    });
  },
  async save() {
    this.checkInfo();
    wx.showLoading({
      title: "正面照上传中...",
      mask: true
    });
    const { identiFront, identiBack, identiName, identiId } = this.data;
    const openid = await this.getOpenId();
    // 上传正面图片，获得云储存fileId
    const frontFileId = await this.upload(openid, identiFront, true);
    wx.showLoading({
      title: "反面照上传中...",
      mask: true
    });
    // 上传反面图片，获得云储存fileId
    const backFileId = await this.upload(openid, identiBack, false);
    // 更新user表
    wx.showLoading({
      title: "申请认证中...",
      mask: true
    });
    const { errMsg } = await wx.cloud.callFunction({
      name: "users",
      data: {
        type: "updateUserInfo",
        identiName,
        identiId,
        identiFront: frontFileId,
        identiBack: backFileId
      }
    });
    if (errMsg === "cloud.callFunction:ok") {
      this.setData({
        identi: 2
      });
      wx.showLoading({
        title: "正在审核中...",
        mask: true
      });
    } else {
      wx.showToast({
        title: "申请认证失败，请重新认证",
        icon: "none"
      });
    }
    setTimeout(() => {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }, 2000);
  },

  // 校验相关数据
  checkInfo() {
    const { identiFront, identiBack, identiName, identiId } = this.data;
    if (!identiName) {
      wx.showToast({ title: "请输入证件姓名", icon: "none" });
      throw new Error("请输入证件姓名");
    }
    if (!identiId) {
      wx.showToast({ title: "请输入证件号码", icon: "none" });
      throw new Error("请输入证件号码");
    }
    if (identiId && identiId.length !== 18) {
      wx.showToast({ title: "请输入正确的证件号码", icon: "none" });
      throw new Error("请输入正确的证件号码");
    }
    if (!identiFront) {
      wx.showToast({ title: "请上传身份证正面照", icon: "none" });
      throw new Error("请上传身份证正面照");
    }
    if (!identiBack) {
      wx.showToast({ title: "请上传身份证反面照", icon: "none" });
      throw new Error("请上传身份证反面照");
    }
  },

  // 上传文件
  async upload(openid, filePath, isFront) {
    const tempName = isFront ? "identiFront" : "identiBack";
    // 如果没有选择过图片，直接返回fileId
    if (!this[tempName]) {
      return filePath;
    }
    const suffix = this.getImageSuffix(filePath);
    const { fileID } = await wx.cloud.uploadFile({
      cloudPath:
        "identi_image/" + openid + "/" + (isFront ? "front" : "back") + suffix, // 云储存上的路径
      filePath // 文件临时路径
    });
    return fileID;
  },

  // 获取openid
  async getOpenId() {
    const { result } = await wx.cloud.callFunction({
      name: "utils",
      data: {
        type: "getOpenid"
      }
    });
    console.log("getOpenid", result);

    return result;
  },

  // 获取图片后缀
  getImageSuffix(filePath) {
    const index = filePath.lastIndexOf(".");
    return filePath.substr(index);
  },

  onReady: function() {},

  onShow: function() {},

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {},

  onReachBottom: function() {},

  onShareAppMessage: function() {}
});
