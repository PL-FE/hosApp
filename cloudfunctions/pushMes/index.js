// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  let { name,
    no,
    department,
    time,
    office,
    category,
    phone,
    sex } = event

  const result = await cloud.openapi.subscribeMessage.send({
    touser: wxContext.OPENID,
    page:'pages/home/home',//订阅消息点击后跳转的路径
    data: {//data就放模板规定的字段就好,注意字段类型哦
      // 预约人
      name1: {
            value: name
        },
        // 预约时间
        date3: {
            value: time
        },
        // 预约结果
        phrase9: {
            value: '预约成功'
        },
        // 温馨提示
        thing8: {
            value: '预约开始后30分钟内有效'
        }
    },
    templateId: 'eB3bNOUJAqHlROQvc-UBrpczSGFR_I2yS4CGE-t40g8'
  })
}