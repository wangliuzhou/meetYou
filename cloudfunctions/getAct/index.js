const cloud = require('wx-server-sdk')
exports.main = async (event, context) => {
  const wxContext = await cloud.getWXContext();
  cloud.init({
    env: wxContext.ENV
  });
  const db = cloud.database()
  const $ = db.command.aggregate
  let res = await db.collection('activity').orderBy('id', 'desc').where({
    show: true,
    status: 1 || 2
  }).get()
  let act = res.data
  for (var i = 0; i < act.length; i++) {
    delete act[i]._id,
      delete act[i].create_time

  }
  return {
    act
  }
}