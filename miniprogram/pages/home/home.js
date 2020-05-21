// 首页 第一个页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
  },
  
  // 跳转到预约页面 subhome是预约页面的布局
  handleAppoint () {
      wx.navigateTo({
        url: '../subhome/subhome'
      })
      return
  },
  // 跳转到数据分析页面
  handleCharts () {
      wx.navigateTo({
        url: '../datacharts/datacharts'
      })
      return
  }
})