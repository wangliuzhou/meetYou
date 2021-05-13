const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  return await db.collection("log").add({
    data: {
      a: event
    }
  });
  // 创建订单
  const { OPENID } = cloud.getWXContext(); // 获取上下文
  // 修改order表里的status
  await db
    .collection("order")
    .doc(event.outTradeNo)
    .update({
      data: {
        status: 1
      }
    });

  // 修改activity表里的boys/girls
  const { data } = await db
    .collection("order")
    .doc(event.outTradeNo)
    .get();
  return data;
};
