
const activeName = ['预约', '历史']
Page({
  data: {
    active: 0,
    activeName: '预约'
  },
  onChangeTabs(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail, activeName: activeName[event.detail] });
  },
  onClickBack() {
    wx.redirectTo({
      url: '/pages/home/home',
    })
    return
    wx.showToast({ title: '点击返回', icon: 'none' });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})