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
    // 调用相机API,获取二维码内容，如果是ok则到达成功，反之返回到达失败！
    // 预定好预约到达的暗号是 'ok'
    handlePass (e) {
      const vm = this
      wx.scanCode({
        success (res) {
          console.log(res)
          if (res.result === 'ok') {
            vm.passItem(e.target.id)
          } else {
            wx.showToast({
              icon: 'none',
              title: '到达失败！ ',
            })
          }
        }
      })
    },

    passItem (id) {
      wx.cloud.callFunction({
        name: 'updateUser',
        data: {
          id:id,
          status: 2
        }
      }).then(res => {
        this.init()
        wx.showToast({
          icon: 'none',
          title: '操作成功~',
        })
      })
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
          title: '成功删除一条记录~',
        })
      })
    }
  }
 
})