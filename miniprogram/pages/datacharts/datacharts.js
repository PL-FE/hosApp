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
      this.setData({
        userList: twoWeekData.reverse()
      })

      this.init1()
    })
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
