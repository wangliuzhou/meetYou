/**
 * onShareAppMessage的触发
 */
export const shareAct = async path => {
  const app = getApp();
  wx.showLoading({
    title: "分享中...",
    mask: true
  });
  const { title, sn } = app.temp;
  const { result } = await wx.cloud.callFunction({
    name: "utils",
    data: {
      type: "getOpenid"
    }
  });
  wx.hideLoading();
  return {
    title, // 默认是小程序的名称(可以写slogan等)
    path: `${path}?sn=${sn}&openid=${result}&create_time=${+new Date()}`, // 默认是当前页面，必须是以‘/’开头的完整路径
    imageUrl: "" //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
  };
};

/**
 * 被分享用户扫码/点击进入小程序
 * 上报分享者信息并加1条分享信息
 * @param {*} options
 */
export const onUserOpenApp = async options => {
  const { sn, openid, create_time } = options;
  if (!openid || !create_time) return;
  await wx.cloud.callFunction({
    name: "share",
    data: {
      type: "onUserOpenApp",
      sn,
      openid,
      create_time,
      open_time: +new Date()
    }
  });
};

export const shareMyCard = async () => {
  wx.showLoading({
    title: "小程序码生成中...",
    icon: "none"
  });
  wx.cloud
    .callFunction({
      // 请求云函数
      // 云函数getQrCode
      name: "share",
      data: {
        type: "getQrCode",
        create_time: +new Date()
      }
    })
    .then(res => {
      console.log(res);
      const fileId = res.result;
      wx.previewImage({
        // 小程序码,生成后直接预览,前台展示
        urls: [fileId],
        current: fileId
      });
      wx.hideLoading();
    })
    .catch(err => {
      console.log(err);
    });
};
