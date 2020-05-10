// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const db = cloud.database()
  const user = db.collection('user')
  const {status} = event
  let result = []
  if (status) {
    result = await user.orderBy('time', 'desc').where({
    }).get()
  } else {
    result = await user.orderBy('time', 'desc').where({
      createUser: OPENID
    }).get()
  }
  let data = result.data

  const newTime = new Date().valueOf()

  // 0 未开始
  // 1 有效时间
  // -1 失效
  // 2 已完成
  data.forEach(it => {
    it.time = new Date(it.time).valueOf()
    if (!it.status) {
      if (newTime - it.time > 1800000) {
        it.status = -1
      } else if (newTime < it.time) {
        it.status = 0
      } else {
        it.status = 1
      }
    }
  })

  data.forEach(it => {
    // 区间重叠算法
    // 1、Begin = Max(A1, B1);
    // 2、End = Min(A2, B2);
    // 3、Len = End - Begin
    const startTime = it.time
    const endTime = it.time + 1800000
    data.forEach(s => {
      s.time = new Date(s.time).valueOf()
      const sTime = s.time
      const eTime = s.time + 1800000
      const Begin = Math.max(startTime, sTime)
      const End = Math.min(endTime, eTime)
      const yx = s.status === 0 || s.status === 1
      if (End - Begin > 0 && yx) {
        it.countActivate = it.countActivate ? it.countActivate + 1 : 1
      }
    })
  })

  return {
    data: result.data
  }

  
}

