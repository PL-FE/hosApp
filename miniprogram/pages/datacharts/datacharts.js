//index.js
//获取应用实例
const app = getApp()
import { echartlinefn, init, hybridData, echartPiefn, echartBarfn } from '../../utils/common';
const db = wx.cloud.database()
const { times } = require('../../utils/util.js')

Page({
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true,
    },
    color: '#2f4554',
    userList: [],
    scrollText: ""
  },

  onLoad () {
    this.init()
  },

  init() {
    wx.cloud.callFunction({
      name: 'getUser',
      data: {
        status: 'all'
      }
    }).then(res => {
      this.selectComponent('#overlay').onClickHide()
      let data = res.result.data
      // 过滤出最近上一周和下一周的预约数据
      let twoWeekData = data.filter(it => it.time > new Date().getTime() - 604800000 && it.time < new Date().getTime() + 604800000)
      // 做一下时间格式转换
      twoWeekData.forEach(it => {
        it.time = times(it.time)
        it.createTime = times(it.createTime)
      })
      // 时间换一下顺序，新的时间在后面
      const userList = twoWeekData.reverse()
      // 初始化滚动文字
      this.initScrollText(userList)
      this.setData({
        userList
      })
      // 初始化图表
      this.init1()
    })
  },

  // 传入数据，计算数据中每一项出现的次数，如xx学院出现了几次，展示用
  count (data) {
    return data.reduce(function (allNames, name) {
      if (name in allNames) {
        allNames[name]++;
      }
      else {
        allNames[name] = 1;
      }
      return allNames;
    }, {});

  },
  // 传入一个字段，和数据
  // 找出该数据中，哪个字段的值最大
  getMax(fieId, maxData){
    let max = 0
    let maxFieId
    for (let i in maxData) {
      if (maxData[i] > max) {
        max = maxData[i]
        maxFieId = i
      }
    }

    return maxFieId
  },
  initScrollText (data) {
    // 计算出当前的时间，拿去显示
    const today = times(new Date().getTime())
    // 计算性别，拿去显示
    // 从数据中取出 sex，并分出来男女
    // sex0 男
    // sex1 女
    const sex0 = data.map(it => it.sex).filter(it => it === '0')
    const sex1 = data.map(it => it.sex).filter(it => it === '1')
    // 选出昨天和今天的数据，拿去显示
    // filter 过滤出昨天的人数
    const yesterdayCount = data.filter(it => it.time.split(' ')[0] === times(new Date().getTime() - 86400000).split(' ')[0])
    const todayCount = data.filter(it => it.time.split(' ')[0] === times(new Date().getTime()).split(' ')[0])
    // 计算学院，拿去显示， 关于 count 的使用看 51 行注释
    const maxDepartmentData = this.count(data.map(it => it.department[0]))
    let arr = Object.entries(maxDepartmentData).sort((a, b) => b[1] - a[1])
    let strDepartment = ''
    arr.forEach(it => {
      strDepartment = strDepartment + `${it[0]} 占 ${(it[1] * 100 / data.length).toFixed(2)}%，`
    })
    console.log(data)
    // 计算病类，拿去显示
    // 关于 count 的使用看 51 行注释
    const maxCategoryData = this.count(data.map(it => it.category))
    arr = Object.entries(maxCategoryData).sort((a, b) => b[1] - a[1])
    let strCategory = ''
    strCategory = `"${arr[0][0]}"、"${arr[1][0]}"、"${arr[2][0]}"`
    // 计算预约最多的日期，拿去显示
    // 关于 count 的使用看 51 行注释
    // 关于 getMax 的使用看 64 行注释
    const maxTimeData = this.count(data.map(it => it.time.split(' ')[0]))
    let maxTime = this.getMax('time', maxTimeData)

    const scrollText = `截至 ${today}，
    总共有${data.length}人预约，
    其中，男生${sex0.length}人，
    女生${sex1.length}人，
    ${strDepartment}
    出现 ${strCategory}的病情较多，
    于${maxTime}预约人数最多，
    相较于昨天，今天预约新增共${todayCount.length - yesterdayCount.length}人`
    this.setData({
      scrollText
    })
  },

  handleScrolText (e) {
   // 点击滚动文字
  },
  
  init1 () {
    // 初始化图表
    init(
      // 绑定元素
      this.selectComponent('#ec_line'),
      // 配置
      echartlinefn(
        hybridData(this.data.userList, 'time'),
        '人数'
      )
    );
    init(
      this.selectComponent('#ec_bar'),
      // 配置
      echartBarfn(
        hybridData(this.data.userList, 'department'),
      )
    );
    init(
      this.selectComponent('#ec_pie'),
      // 配置
      echartPiefn(
        this.data.userList
      )
    );
  }
})
