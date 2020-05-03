// pages/history/history.js
const db = wx.cloud.database()
const { times } = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    refreStatus: false
  },
  
  onLoad (options) {
    this.init()
  },

  onClose(event) {
      const {
        position,
        instance
      } = event.detail;
      switch (position) {
        case 'cell':
          instance.close();
          break;
        case 'right':
        case 'outside':
          instance.close()
          break;
      }
  },

  init () {
    wx.cloud.callFunction({
      name: 'getUser',
      data: {
        status: 'all'
      }
    }).then(res => {
      let data = res.result.data
      data.forEach(it => {
        it.time = times(it.time)
        it.createTime = times(it.createTime)
      })
      this.selectComponent('#overlay').onClickHide()
      this.setData({
        userList: data,
        refreStatus: false
      })
    })
  },

  handlePhone (event) {
    wx.makePhoneCall({
      phoneNumber: event.target.dataset.tel
    })
  },

  handlePass (event) {
    console.log(event)
    wx.cloud.callFunction({
      name: 'updateUser',
      data: {
        id: event.target.id,
        status:2
      }
    }).then(res => {
      this.init()
      wx.showToast({
        icon: 'none',
        title: '操作成功~',
      })
    })
  },

  handleDelete(event) {
    const vm = this
    wx.cloud.callFunction({
      name: 'deleteUser',
      data: {
        id: event.target.id
      }
    }).then(res => {
        this.init()
        wx.showToast({
          icon: 'none',
          title: '成功删除一条记录~',
        })
      })
  },

  handleRefresh () {
    this.selectComponent('#overlay').onClickHide(true)
    this.init()
  }
})
