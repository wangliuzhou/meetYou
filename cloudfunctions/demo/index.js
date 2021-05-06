const cloud = require('wx-server-sdk')
exports.main = async event => {
  const wxContext = await cloud.getWXContext();
  cloud.init({
    env: wxContext.ENV
  });
  const db = cloud.database();
  const _ = db.command;
  const data =await db.collection('users').where({
    base:_.exists(true)
  }).orderBy('createTime', 'desc').limit(3).field({
    _id: false
}).get().then(res=>{return res.data});
  

  return data
}