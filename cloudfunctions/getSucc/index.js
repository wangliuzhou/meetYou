const cloud = require('wx-server-sdk')
exports.main = async (event, context) => {
  const wxContext = await cloud.getWXContext();
  cloud.init({
    env: wxContext.ENV
  });
  const db = cloud.database()
  const $ = db.command.aggregate
  let res = await db.collection('success').aggregate().sample({size: 2}).end()
let cases=res.list
for(var i=0;i<cases.length;i++){
delete cases[i]._id,
delete cases[i].createTime,
delete cases[i].tel,
cases[i].time=formatTime(cases[i].time)
}
  return {
    cases,
      }
}

function formatTime(e) {
  var t=new Date(e)
  var year = t.getFullYear()
  var month = t.getMonth() + 1
  var day = t.getDate()
   return [year, month, day].map(formatNumber).join('-') 
 }
 const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}