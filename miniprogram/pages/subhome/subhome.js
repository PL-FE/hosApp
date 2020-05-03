
const activeName = ['预约', '历史']
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    active: 0,
    activeName: '预约',
    refreStatus: false,
    showDialogAdmin: false,
    pwd: ''
  },

  onChangeTabs(event) {
    this.setData({ active: event.detail, activeName: activeName[event.detail] });
  },

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

  onClickBack() {
    wx.navigateTo({
      url: '/pages/home/home',
    })
    return
    wx.showToast({ title: '点击返回', icon: 'none' });
  },
  
  openSeting(e) {
    this.setData({
      pwd: '',
      showDialogAdmin: true
    })
    // wx.navigateTo({
    //   url: '/pages/admin/admin',
    // })
  },

  handleRefresh (e) {
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

  closeDialogAdmin () {
    this.setData({
      // showDialogAdmin: false
    })
  },

  checkAdminInfo (e) {
    wx.cloud.callFunction({
      name: 'getAdmin',
      data:{
        pwd: this.data.pwd
      }
    }).then(res => {
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