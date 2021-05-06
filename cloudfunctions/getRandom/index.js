const cloud = require('wx-server-sdk')
exports.main = async (event, context) => {
  const wxContext = await cloud.getWXContext();
  cloud.init({
    env: wxContext.ENV
  });
  const db = cloud.database()
  const $ = db.command.aggregate
  let info = await db.collection('info').where({
    _id: 'random_act',
  }).get()
  // 男的
  let res1 = await db.collection('random_act').where({
    done: false,
    sex: '1'
  }).count()
  // 女的
  let res2 = await db.collection('random_act').where({
    done: false,
    sex: '2'
  }).count()
  // 总参与人
  let res3 = await db.collection('random_act').count()
  // 过去活动
  let res4 = await db.collection('pass_act').where({
    type: 'r',
  }).count()
  return {
    ...info.data[0],
    boy: res1.total,
    girl: res2.total,
    total_person:res3.total,
    pass_no: res4.total,
  }
}