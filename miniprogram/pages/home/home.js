// miniprogram/pages/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
  },
  
  handleAppoint () {
      wx.navigateTo({
        url: '../subhome/subhome'
      })
      return
  },

  handleCharts () {
      wx.navigateTo({
        url: '../datacharts/datacharts'
      })
      return
  }
})