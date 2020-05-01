//index.js
//获取应用实例
const app = getApp()
import { echartlinefn, init, hybridData } from '../../utils/common';
const db = wx.cloud.database()
const { times } = require('../../utils/util.js')

Page({
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true,
      // disableTouch: true
    },
    color: '##557bd9',
    userList: []
  },
  onLoad: function () {
    this.init()
    
  },
  init() {
    wx.cloud.callFunction({
      name: 'getUser'
    }).then(res => {
      let data = res.result.data
      data.forEach(it => {
        it.time = times(it.time)
        it.createTime = times(it.createTime)
      })
      this.setData({
        userList: data
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
  }
})
