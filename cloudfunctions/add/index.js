// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  let initData = {
    createTime: new Date().valueOf(),
    createUser: OPENID, // 用 {openid} 变量，后台会自动替换为当前用户 openid
  }
  let { name,
        no,
        department,
        time,
        office,
        category,
        phone } = event


  const db = cloud.database()
  const user = db.collection('user')
  const result = await user.add({
    data: {
      name,
      no,
      department,
      time,
      office,
      category,
      phone,
      ...initData
    },
  })

  return result
}
