const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  let info_m = await db.collection('info')
    .where({
      _id: 'matchMaker',
    }).get().then(res => {
      return res.data[0]
    }).catch(err => {
      return 0
    })
    let list_u = await db.collection('users').aggregate().match({
      recommend:true
    }).sample({
      size: 2
    }).end();
     return {
    info_m,
    info_u:list_u.list
  }
}
