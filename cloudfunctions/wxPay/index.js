// wxpay
// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext(); // 获取上下文
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
        place,
        gender
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
          title,
          gender
        }
      });

      return await cloud.cloudPay.unifiedOrder({
        body: title,
        outTradeNo: _id,
        // outTradeNo: +new Date() + ("" + Math.random()).substr(2),
        spbillCreateIp: JSON.parse(context.environment).WX_CLIENTIP,
        subMchId: "1608070310",
        // 避免19.9*100=1998.9999998之类的二进制问题
        totalFee: Math.round(real_cost * 100),
        envId: "manage-6ga290rpb99a0dbd",
        functionName: "unifiedOrderCb"
      });
    } else if (type === "refund") {
      const { _id, real_cost, return_rate, gender, sn } = event;
      const res = await cloud.cloudPay.refund({
        out_trade_no: _id,
        out_refund_no: +new Date() + ("" + Math.random()).substr(2),
        nonce_str: +new Date() + ("" + Math.random()).substr(2),
        sub_mch_id: "1608070310",
        total_fee: real_cost * 100,
        refund_fee: real_cost * return_rate,
        envId: "manage-6ga290rpb99a0dbd"
        // functionName: "refundCb"
      });
      if (res.resultCode == "SUCCESS") {
        const resq = await cloud.cloudPay.queryOrder({
          sub_mch_id: "1608070310",
          out_trade_no: _id
        });
        if (resq.resultCode == "SUCCESS") {
          // 更新activity和order
          // 更新订单中的状态
          await db
            .collection("order")
            .doc(_id)
            .update({
              data: {
                status: 2
              }
            });

          // 删除activity表的boys/girls数据
          const sex = gender ? "boys" : "girls";
          await db
            .collection("activity")
            .where({ sn })
            .update({
              data: {
                [sex]: _.pull(OPENID)
              }
            });

          return {
            code: 0
          };
        }
      }
      return {
        code: 1,
        pay: res.returnMsg
      };
    } else if (type === "randomActivity") {
      let { real_cost, nikeName, gender } = event;
      // 首先去创建订单
      const { _id } = await db.collection("random_act").add({
        data: {
          status: 0, //0未支付  1已支付  2已退款
          real_cost,
          openid: OPENID,
          createTime: +new Date(),
          nikeName,
          gender,
          done: false
        }
      });
      return await cloud.cloudPay.unifiedOrder({
        body: "随机活动",
        outTradeNo: _id,
        spbillCreateIp: JSON.parse(context.environment).WX_CLIENTIP,
        subMchId: "1608070310",
        // 避免19.9*100=1998.9999998之类的二进制问题
        totalFee: Math.round(real_cost * 100),
        envId: "manage-6ga290rpb99a0dbd",
        functionName: "randomActivityCb"
      });
    }
  } catch (e) {
    console.error(e);
  }
};
