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
      let twoWeekData = data.filter(it => it.time > new Date().getTime() - 604800000 && it.time < new Date().getTime() + 604800000)
      twoWeekData.forEach(it => {
        it.time = times(it.time)
        it.createTime = times(it.createTime)
      })
      const userList = twoWeekData.reverse()
      this.initScrollText(userList)
      this.setData({
        userList
      })

      this.init1()
    })
  },

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
    // TODO: 过滤到昨天
    const today = times(new Date().getTime())
    // 计算性别
    const sex0 = data.map(it => it.sex).filter(it => it === '0')
    const sex1 = data.map(it => it.sex).filter(it => it === '1')
    // 选出昨天和今天的数据
    const yesterdayCount = data.filter(it => it.time.split(' ')[0] === times(new Date().getTime() - 86400000).split(' ')[0])
    const todayCount = data.filter(it => it.time.split(' ')[0] === times(new Date().getTime()).split(' ')[0])
    
    // 计算学院
    const maxDepartmentData = this.count(data.map(it => it.department[0]))
    arr = Object.entries(maxDepartmentData).sort((a, b) => b[1] - a[1])
    let strDepartment = ''
    arr.forEach(it => {
      strDepartment = strDepartment + `${it[0]} 占 ${(it[1] * 100 / data.length).toFixed(2)}%，`
    })
    console.log(data)
    // let maxdepartment = this.getMax('department', maxDepartmentData)
    // 计算病类
    const maxCategoryData = this.count(data.map(it => it.category))
    // let maxCategory = this.getMax('category', maxCategoryData)
    arr = Object.entries(maxCategoryData).sort((a, b) => b[1] - a[1])
    let strCategory = ''
    strCategory = `"${arr[0][0]}"、"${arr[1][0]}"、"${arr[2][0]}"`
    // 计算预约最多的日期
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
    init(
      this.selectComponent('#ec_line'),
      echartlinefn(
        this.data.color,
        hybridData(this.data.userList, 'time'),
        this.data.userList,
        'countActivate',
        '人数'
      )
    );
    init(
      this.selectComponent('#ec_bar'),
      echartBarfn(
        this.data.color,
        hybridData(this.data.userList, 'department'),
        this.data.userList,
        'countActivate',
        '人数'
      )
    );
    init(
      this.selectComponent('#ec_pie'),
      echartPiefn(
        this.data.color,
        hybridData(this.data.userList, 'department'),
        this.data.userList,
        'countActivate',
        '人数'
      )
    );
  }
})
