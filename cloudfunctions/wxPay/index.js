// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext(); // 获取上下文
  const { type } = event;
  try {
    if (type === "unifiedOrder") {
      const {
        title,
        real_cost,
        return_rate,
        sn,
        nikeName,
        act_time,
        place
      } = event;

      // 首先去创建订单
      const { _id } = await db.collection("order").add({
        data: {
          sn,
          status: 0, //0未支付  1已支付  2已退款
          real_cost,
          return_rate,
          openid: OPENID,
          createTime: +new Date(),
          nikeName,
          act_time,
          place,
          title
        }
      });

      return await cloud.cloudPay.unifiedOrder({
        body: title,
        outTradeNo: _id,
        // outTradeNo: +new Date() + ("" + Math.random()).substr(2),
        spbillCreateIp: JSON.parse(context.environment).WX_CLIENTIP,
        subMchId: "1608070310",
        totalFee: real_cost * 100,
        envId: "manage-6ga290rpb99a0dbd",
        functionName: "unifiedOrderCb"
      });
    } else if (type === "refund") {
      await db.collection("log").add({
        data: {
          b: event
        }
      });
      const { _id, real_cost, return_rate } = event;
      return await cloud.cloudPay.refund({
        out_trade_no: _id,
        out_refund_no: out_trade_no + 1,
        nonce_str: +new Date() + ("" + Math.random()).substr(2),
        sub_mch_id: "1608070310",
        total_fee: real_cost * 100,
        refund_fee: real_cost * return_rate,
        envId: "manage-6ga290rpb99a0dbd",
        functionName: "refundCb"
      });
    }
  } catch (e) {
    console.error(e);
  }
};
