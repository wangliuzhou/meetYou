// 随机活动的支付回调
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext(); // 获取上下文
  const res = await cloud.cloudPay.queryOrder({
    sub_mch_id: "1608070310",
    out_trade_no: event.outTradeNo
  });

  if (res.returnCode == "SUCCESS") {
    // 更新订单中的状态
    await db
      .collection("random_act")
      .doc(event.outTradeNo)
      .update({
        data: {
          status: 1
        }
      });
    // 查询订单表数据
    const { data } = await db
      .collection("random_act")
      .doc(event.outTradeNo)
      .get();

    // 模板消息发送
    await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      page: "pages/index/index",
      data: {
        thing1: {
          value: data.nikeName
        },
        thing2: {
          value: "随机活动"
        },
        date3: {
          value: "时间不定"
        },
        phrase5: {
          value: "付款成功"
        },
        thing10: {
          value: "地点不定"
        }
      },
      // TODU 发布前注释下面
      miniprogramState: "developer",
      templateId: "1TYG9Mw5wZuW6wKpOsMOZpI0UnvHQPiXKcD9KiFl7_c"
    });
    return { errcode: 0, errmsg: "" };
  }
};
