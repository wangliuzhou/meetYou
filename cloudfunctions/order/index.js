// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext(); // 获取上下文
  const { type } = event;
  if (type === "getOrderInfo") {
    return await db
      .collection("order")
      .where({
        openid: OPENID,
        sn: event.sn,
        status: 1
      })
      .get();
  }
};
