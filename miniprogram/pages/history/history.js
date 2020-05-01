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
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
      this.init()
    }
  
  },
  pageLifetimes: {
 
  },
  methods: {
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
        name: 'getUser'
      }).then(res => {
        let data = res.result.data
        data.forEach(it => {
          it.time = times(it.time)
          it.createTime = times(it.createTime)
        })
        console.log(data)
        this.setData({
          userList: data
        })
      })
    }
  },

 
})