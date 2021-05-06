const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  var profile_Path = 'make_user/profile/' + event.userCode + '-' + 'p' + '-' + Date.now() + Math.round(Math.random() * 10) + event.extension;
  var avatar_path = 'make_user/avatar/' + event.userCode + '-' + 'a' + '-' + Date.now() + Math.round(Math.random() * 10) + event.avatar.extension;
  try {
    let path1 = await cloud.uploadFile({
      fileContent: Buffer.from(event.fileContent, 'base64'),
      cloudPath: profile_Path,
    })
    let path2 = await cloud.uploadFile({
      fileContent: Buffer.from(event.avatar.fileContent, 'base64'),
      cloudPath: avatar_path,
    })
    await db.collection('users')
      .where({
        userCode: event.userCode
      })
      .update({
        data: {
          profile: path1.fileID,
          wxUserInfo: {
            avatarUrl: path2.fileID,
            gender: event.gender
          },
          identi: 1,
          property_cert: 1,
          info_auth: 1,
          vip: Math.floor(Math.random() * 3),
          show: true, //这个建议放到加展示照片这里
          comments: [],
          evaluation: '',
          remarks: '',
          dishonour: [],
          password: '',
          coins: Math.floor(Math.random() * 100),
          pics: [],
          premium: 1,
          recommend: true, //添加20个后，改成false，以后就是false.
          vipTime: Date.now() + (Math.floor(Math.random() * 150) + 30) * 1000 * 60 * 60 * 24,
          // 随机加vip天数
          visits: Math.floor(Math.random() * 1000),
        }
      })

    return {
      profile_Path: path1.fileID,
      avatar_path: path2.fileID
    }
  } catch (e) {
    return e
  }

}