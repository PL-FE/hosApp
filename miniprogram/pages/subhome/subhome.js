
const activeName = ['预约', '历史']
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
// 包含预约页和历史页的一个容器
Page({
  data: {
    active: 0,
    activeName: '预约',
    refreStatus: false,
    showDialogAdmin: false,
    pwd: ''
  },

  // 点击底部操作栏触发的方法
  onChangeTabs(event) {
    this.setData({ active: event.detail, activeName: activeName[event.detail] });
  },

  // 这个方法是给子组件用的
  onDelete(event) {
    console.log(event)
    const vm = this
    Dialog.confirm({
      title: '确认',
      message: '是否确认删除？'
    }).then(() => {
      this.selectComponent('#history').deleteItem(event)
    }).catch(() => {
      // on cancel
    });
   
  },

  // 统一的返回，这里写死是首页
  onClickBack() {
    wx.navigateTo({
      url: '/pages/home/home',
    })
    return
    wx.showToast({ title: '点击返回', icon: 'none' });
  },
  
  // 打开管理员设置
  openSeting(e) {
    this.setData({
      pwd: '',
      showDialogAdmin: true
    })
    // wx.navigateTo({
    //   url: '/pages/admin/admin',
    // })
  },

  // 刷新
  handleRefresh (e) {
    // 判断在哪个页面的刷新，再去调相关页面的刷新方法
    if (this.data.active === 1) {
      this.selectComponent('#history').refresh(()=> {
        this.setData({
          refreStatus: false
        })
      })
    } else {
      this.setData({
        refreStatus: false
      })
    }
  },

  // 检查管理员面对不对
  checkAdminInfo (e) {
    wx.cloud.callFunction({
      name: 'getAdmin',
      data:{
        pwd: this.data.pwd
      }
    }).then(res => {
      // 对了就让进来
      if (res.result) {
        wx.navigateTo({
          url: '/pages/admin/admin',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '🤷‍♂️ 密码不正确~',
        })
      }
    })
  },

  onClose () {
    
  },
  pwdChange (e) {
    this.setData({
      pwd: e.detail
    })
  }
})