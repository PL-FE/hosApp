Component({
  properties: {
    activeName: String
  },

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  methods: {
    onClickBack() {
      wx.redirectTo({
        url: '/pages/home/home',
      })
      return
      wx.showToast({ title: '点击返回', icon: 'none' });
    }
  }
})