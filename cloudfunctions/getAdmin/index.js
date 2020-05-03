// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const db = cloud.database()
  const admin = db.collection('admin')
  
  let result = await admin.get()
  let data = result.data.map(it => it.pwd)
  
  return data.includes(event.pwd)


}

