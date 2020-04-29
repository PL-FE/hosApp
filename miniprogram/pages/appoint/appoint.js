// miniprogram/pages/appoint/appoint.js\
const citys = {
  '9时': ['00分', '30分'],
  '10时': ['00分', '30分'],
  '11时': ['00分', '30分'],
  '14时': ['00分', '30分'],
  '15时': ['00分', '30分'],
  '16时': ['00分', '30分'],
  '17时': ['00分', '30分']
}
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    xueyuan:'',
    nianji:'',
    message:'',
    value: '',
    diseases:[
      {num:'0',value:"感冒",checked:false},
      {num:'1',value:"胃炎",checked:false},
      {num:'2',value:"发烧",checked:false}
    ],
    columns: [
      {
        values: Object.keys(citys),
        className: 'column1'
      },
      {
        values: citys['9时'],
        className: 'column2',
        defaultIndex: 2
      }
    ],
    show: false,
  },
  //获取病类数据
  radioChange(e){
    console.log('单选框：',e.detail.value);
  },
  //获取学院数据
  inputXueyuan(e){
    this.setData({
      xueyuan:e.detail
    }),
    console.log(e);
  },
  //获取年级信息
  inputNianji(e){
    this.setData({
      nianji:e.detail
    }),
    console.log(e);
  },
  //获取病症信息
  inputMsg(e){
    this.setData({
      message:e.detail
    }),
    console.log(e);
  },
  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },


  change(event) {
    const { picker, value, index } = event.detail;
    console.log(event)
    picker.setColumnValues(1, citys[value[0]]);
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
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