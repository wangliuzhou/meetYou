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
    if (type === "addComments") {
      const { sn, avatarUrl, nikeName, comment, createTime } = event;
      return await db
        .collection("activity")
        .where({
          sn
        })
        .update({
          data: {
            comments: _.push({
              each: [
                {
                  avatarUrl,
                  nikeName,
                  comment,
                  createTime,
                  openid: OPENID
                }
              ],
              sort: {
                createTime: -1
              }
            })
          }
        });
    } else if (type === "addRandomComments") {
      const { avatarUrl, nikeName, comment, createTime } = event;
      return await db
        .collection("info")
        .doc("random_act")
        .update({
          data: {
            comments: _.push({
              each: [
                {
                  avatarUrl,
                  nikeName,
                  comment,
                  createTime,
                  openid: OPENID
                }
              ],
              sort: {
                createTime: -1
              }
            })
          }
        });
    }
  } catch (e) {
    console.error(e);
  }
};
