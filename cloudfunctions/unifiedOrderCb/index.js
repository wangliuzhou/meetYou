const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  // 创建订单
  const { OPENID } = cloud.getWXContext(); // 获取上下文
  // 更新订单中的状态
  await db
    .collection("order")
    .doc(event.outTradeNo)
    .update({
      data: {
        status: 1
      }
    });
  const { data } = await db
    .collection("order")
    .doc(event.outTradeNo)
    .get();
  // 模板消息发送
  return await cloud.openapi.subscribeMessage.send({
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
    miniprogramState: "developer",
    templateId: "1TYG9Mw5wZuW6wKpOsMOZpI0UnvHQPiXKcD9KiFl7_c"
  });
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
