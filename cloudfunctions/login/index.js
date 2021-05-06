const cloud = require('wx-server-sdk')
exports.main = async event => {
  const wxContext = await cloud.getWXContext();
  cloud.init({
    env: wxContext.ENV
  });
  const db = cloud.database();
  const _ = db.command;
  try {
    // 访问数量加1
    await db.collection('info').doc('system').update({
      data: {
        visits: _.inc(1)
      }
    })
    // 取得系统信息
    const systemInfo = await db
      .collection('info')
      .doc('system').get().then(res => {
        return res.data
      });
    delete systemInfo._id;
    delete systemInfo.openid;
    delete systemInfo.swiper;
    // 如果有客户资料，就返回资料，和code：2，没有就返回code：1，，错误返回code：3
    const userInfo = await db
      .collection('users')
      .where({
        openid: wxContext.OPENID,
      }).get().then(res => {
        return res.data[0]
      });
    if (userInfo) {
      delete userInfo.passwd;
      delete userInfo.show;
      // 客户访问增1
      await db.collection('users').doc(userInfo._id).update({
        data: {
          visits: _.inc(1)
        }
      })
      return {
        code: 2,
        userInfo,
        systemInfo
      }
    }
    return {
      code: 1,
      systemInfo
    }
  } catch (e) {
    return {
      systemInfo,
      code: 3,
      message: e.message,
    };
  }
}