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
      .collection("order")
      .doc(event.outTradeNo)
      .update({
        data: {
          status: 1
        }
      });
    // 查询订单表数据
    const { data } = await db
      .collection("order")
      .doc(event.outTradeNo)
      .get();

    // 查询activity表
    const activityData = await db
      .collection("activity")
      .where({
        sn: data.sn
      })
      .get();

    const sex = data.gender ? "boys" : "girls";

    // 微信可能会多次回调
    // 此处判断一下，只push一次
    if (!activityData.data[0][sex].includes(OPENID)) {
      // 更新activity表的boys/girls数据
      await db
        .collection("activity")
        .where({
          sn: data.sn
        })
        .update({
          data: {
            [sex]: _.push({
              each: [OPENID]
            })
          }
        });
    }

    // 模板消息发送
    await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      page: "pages/index/index",
      data: {
        thing1: {
          value: data.nikeName
        },
        thing2: {
          value: data.title
        },
        date3: {
          value: format(data.act_time)
        },
        phrase5: {
          value: "预约成功"
        },
        thing10: {
          value: data.place
        }
      },
      // TODU 发布前注释下面
      miniprogramState: "developer",
      templateId: "1TYG9Mw5wZuW6wKpOsMOZpI0UnvHQPiXKcD9KiFl7_c"
    });
    return { errcode: 0, errmsg: "" };
  }
};

function add0(m) {
  return m < 10 ? "0" + m : m;
}
function format(timestamp) {
  var time = new Date(timestamp);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
}
