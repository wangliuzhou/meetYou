// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const { type } = event;
  if (type === "onUserOpenApp") {
    /**
     * 用户点击分享进入小程序
     */
    delete event.type;
    delete event.userInfo;
    await db.collection("share").add({
      data: event
    });
  } else if (type === "getQrCode") {
    /**
     * 生成用户小程序码名片
     */
    const { OPENID } = cloud.getWXContext(); // 获取上下文
    const params = {
      create_time: event.create_time,
      openid: OPENID
    };
    // 为了解决小程序码传参最多只能32位字符的限制
    // 此处生成unipueId，传给小程序码
    // 用户扫码登录，接收unipueId，并用unipueId去请求qrcodePrams表，得到openid和create_time
    const unipueId = (Math.random() + "").replace(/\D/g, "");
    await db.collection("qrcodeParams").add({
      data: {
        _id: unipueId,
        ...params
      }
    });
    const result = await cloud.openapi.wxacode.getUnlimited({
      // 调用生成小程序码的接口，携带一些参数,例如:scene
      scene: unipueId,
      path: `pages/index/index`
    });
    const upload = await cloud.uploadFile({
      // 生成的小程序码上传到云存储中
      cloudPath: "qrcode/" + Date.now() + "-" + Math.random() + ".png", // 生成的小程序码存储到云存储当中去，路径
      fileContent: result.buffer
    });
    return upload.fileID; // 返回文件的fileID,也就是该图片
  } else if (type === "getQrcodeParams") {
    /**
     * 用户获取小程序码参数并上传给share表数据
     */

    // 查询参数
    const { data } = await db
      .collection("qrcodeParams")
      .doc(event.scene)
      .get();

    // 上传share表
    const { create_time, openid } = data;
    return await db.collection("share").add({
      data: {
        create_time,
        openid,
        open_time: +new Date()
      }
    });
  }
};
