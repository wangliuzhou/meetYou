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
    if (type === "getUserInfo") {
      return await db
        .collection("users")
        .where({
          openid: OPENID
        })
        .get();
    } else if (type === "updateUserInfo") {
      const { identiFront, identiBack, identiName, identiId } = event;
      return await db
        .collection("users")
        .where({
          openid: OPENID
        })
        .update({
          data: {
            identiFront,
            identiBack,
            identiName,
            identiId,
            identi: 2
          }
        });
    } else if (type === "updateBaseInfo") {
      delete event.userInfo;
      delete event.type;
      return await db
        .collection("users")
        .where({
          openid: OPENID
        })
        .update({
          data: {
            base: event
          }
        });
    } else if (type === "updateAskingInfo") {
      delete event.userInfo;
      delete event.type;
      return await db
        .collection("users")
        .where({
          openid: OPENID
        })
        .update({
          data: {
            asking: event
          }
        });
    }
  } catch (e) {
    console.error(e);
  }
};
