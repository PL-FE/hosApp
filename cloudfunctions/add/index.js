// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let { name,
        no,
        department,
        time,
        office,
        category } = event
  const db = cloud.database()
  const user = db.collection('user')
  const result = await user.add({
    data: {
      openid: '{openid}', // 用 {openid} 变量，后台会自动替换为当前用户 openid
      name,
      no,
      department,
      time: new Date(time).valueOf(),
      office,
      category
    },
  })

  return 200
}
