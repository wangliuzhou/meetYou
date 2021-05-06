const cloud = require('wx-server-sdk')
exports.main = async (event, context) => {
  const wxContext = await cloud.getWXContext();
  cloud.init({
    env: wxContext.ENV
  });
  const db = cloud.database()
  const $ = db.command.aggregate
  // 接收分类
  const {
    searchCode,
    userCode
  } = event
  const userinfo = await db.collection('users').where({
    userCode: searchCode
  }).count()
  // const article_likes_ids = userinfo.data[0].article_likes_ids
  // const list = await db.collection("article")
  //   .aggregate()
  //   .addFields({
  //     is_like: $.in(['$_id', article_likes_ids])
  //   })
  //   .project({
  //     content: 0
  //   })
  //   .match({
  //     // RegExp 正则
  //     title: new RegExp(value)
  //   })
  //   .end()
  if (userinfo.total == 1)
    return {
      code: 1,
    }
  else if (userinfo.total > 1)
    return {
      code: 3,
    }

  return {
    code: 2,
  }

};