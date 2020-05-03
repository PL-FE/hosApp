
const activeName = ['预约', '历史']
Page({
  data: {
    active: 0,
    activeName: '预约',
    refreStatus: false
  },

  onChangeTabs(event) {
    this.setData({ active: event.detail, activeName: activeName[event.detail] });
  },

  onClickBack() {
    wx.navigateTo({
      url: '/pages/home/home',
    })
    return
    wx.showToast({ title: '点击返回', icon: 'none' });
  },
  
  openSeting(e) {
    wx.navigateTo({
      url: '/pages/admin/admin',
    })
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
  }
})