const cloud = require('wx-server-sdk')
// 这是用来创建一个虚拟用户
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
exports.main = async (event, context) => {
  var userCode = await noDuplicateCode()
  await db.collection('users')
    .add({
      data: {
        userCode,
        createTime: Date.now(),
        openid: 'f20210423',
        status: 6,
        show:false,
      }
    });
  return {
    userCode
  }

}
async function noDuplicateCode() {
  let Code = randomRangeId(5);
  let num = await db
    .collection('users')
    .where({
      userCode: Code
    })
    .count();
  if (num.total !== 0) {
    return noDuplicateCode()
  }
  return Code;
}

function randomRangeId(num) {
  var returnStr = "",
    charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (var i = 0; i < num; i++) {
    var index = Math.round(Math.random() * (charStr.length - 1));
    returnStr += charStr.substring(index, index + 1);
  }
  return returnStr;
}