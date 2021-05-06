const cloud = require('wx-server-sdk')
exports.main = async event => {
  const wxContext = await cloud.getWXContext();
  cloud.init({
    env: wxContext.ENV
  });
  const db = cloud.database();
  const _ = db.command;
  const data =await db.collection('vote').orderBy('create_time', 'desc').limit(1).field({
    _id: false,
    create_time:false
}).get().then(res=>{return res.data[0]});
    return data
}