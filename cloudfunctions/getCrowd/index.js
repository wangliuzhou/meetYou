const cloud = require('wx-server-sdk')
exports.main = async event => {
  const wxContext = await cloud.getWXContext();
  cloud.init({
    env: wxContext.ENV
  });
  const db = cloud.database();
  const _ = db.command;
  const new_user =await db.collection('users').orderBy('createTime', 'desc').limit(20).field({
    wxUserInfo: true,
    userCode:true,
    _id:false,
}).get().then(res=>{
  console.log(res)
  return res.data});

  const rec_user =await db.collection('users').orderBy('createTime', 'desc').where({
    base:_.exists(true)
  }).limit(3).field({
    openid: false,
    _id:false,
    password:false,
    status:false,
}).get().then(res=>{return res.data});
 
 
  return {new_user,rec_user}
}