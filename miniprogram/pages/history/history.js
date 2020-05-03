// pages/history/history.js
const db = wx.cloud.database()
const { times } = require('../../utils/util.js')


Component({

  /**
   * 页面的初始数据
   */
  data: {
    userList: []
  },

  lifetimes: {
    created() {
    },
    attached() {
      this.init()
    }
  
  },
  
  methods: {
    refresh (cb) {
      this.selectComponent('#overlay').onClickHide(true)
      this.init(cb)
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

    init (cb) {
      wx.cloud.callFunction({
        name: 'getUser'
      }).then(res => {
        let data = res.result.data
        data.forEach(it => {
          it.time = times(it.time)
          it.createTime = times(it.createTime)
        })
        this.selectComponent('#overlay').onClickHide()
        wx.stopPullDownRefresh();
        if (cb) cb()
        this.setData({
          userList: data
        })
      })
    },

    handleDelete(event) {
      this.triggerEvent('parentEvent', event)
    },

    deleteItem(event) {
      console.log(event)
      const vm = this
      wx.cloud.callFunction({
        name: 'deleteUser',
        data: {
          id: event.detail.target.id
        }
      }).then(res => {
        this.init()
        wx.showToast({
          icon: 'none',
          title: '😀 成功删除一条记录~',
        })
      })
    }
  }
 
})