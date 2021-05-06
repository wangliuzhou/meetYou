const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  let base = event.base
  var name = base.name,
    cellphone = base.cellphone,
    wechat = base.wechat,
    contact_info = base.contact_info;
  delete base.name, base.wechat, base.contact_info;
  await db.collection('users')
    .where({
      userCode: event.userCode
    })
    .update({
      data: {
        base,
        name,
        cellphone,
        wechat,
        contact_info,
        asking: event.asking,
      }
    })
  return event.userCode
}