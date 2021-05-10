// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const { type } = event;

  if (type === "getOpenid") {
    /**
     *由于前端未保留openid，要获取
     */
    const wxContext = cloud.getWXContext(); // 获取上下文
    return wxContext.OPENID;
  }
};
