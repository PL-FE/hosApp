// 历史页面
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
    // 这个是刷新，实现下拉刷新
    refresh (cb) {
      // 刷新前用黑色透明挡着表示在请求
      this.selectComponent('#overlay').onClickHide(true)
      this.init(cb)
    },

    // 这个是恢复滑块的样子，具体请看 vant api
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

    // 这个是初始化时间，一进来历史页面就会触发，在小程序生命周期使用，代码18行
    // 这个是组件页面 不是普通页面，所以生命周期以及函数方法与普通页面不用，具体差异请百度，或阅读一下代码。
    init (cb) {
      // 查询数据
      wx.cloud.callFunction({
        name: 'getUser'
      }).then(res => {
        // 将获得数据的时间戳转换成 年月日时分秒
        let data = res.result.data
        data.forEach(it => {
          it.time = times(it.time)
          it.createTime = times(it.createTime)
        })
        // 请求完了 loading 遮罩可以去掉
        this.selectComponent('#overlay').onClickHide()
        // 关闭下拉出来的那个动画
        wx.stopPullDownRefresh();
        // 如果有回调函数，就执行，具体什么是回调函数 百度一下哈。
        if (cb) cb()
        // 将得到的数据保存起来，方便页面调用
        this.setData({
          userList: data
        })
      })
    },

    // 删除记录
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

    // 点到达触发的方法
    passItem (id) {
      wx.cloud.callFunction({
        name: 'updateUser',
        data: {
          id:id,
          status: 2
        }
      }).then(res => {
        // 刷新当前页
        this.init()
        wx.showToast({
          icon: 'none',
          title: '操作成功~',
        })
      })
    },
// 删除
    deleteItem(event) {
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