
const { gradeInfo, departmentInfo, officeInfo, categoryInfo} = require('../../data/user.js')
const { times } = require('../../utils/util.js')
Page({
  data: { 
    name: '',
    no: '',
    department:'',
    time: '',
    office: '',
    category: '',
    gradeInfo: gradeInfo,
    categoryInfo: categoryInfo,
    officeInfo: officeInfo,
    showTime: false,
    showOffice: false,
    showCategory: false,
    showDepartment: false,
    disabled: true,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2021, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    filter(type, options) {
      if (type === 'minute') {
        return options.filter(option => option % 30 === 0)
      }
      return options;
    },
    departmentList: [
      {
        values: Object.keys(departmentInfo),
        className: 'column1'
      },
      {
        values: departmentInfo['浙江'],
        className: 'column2',
        defaultIndex: 2
      }
    ]
  },
  verifyFrom () {
    const {
      name,
      no,
      department,
      time,
      office,
      category,
    } = this.data
    let disabled = true
    if (name && no && department && time.length && office.length && category.length) {
      disabled = false
    }
      this.setData({
        disabled
      });
  },
  formSubmit (e) {
   const  {
     name,
     no,
     department,
     time,
     office,
     category,
   } = this.data
    const data = {
      name,
      no,
      department,
      time,
      office,
      category}
  this.submit(data)
  },
  showPopup (e) {
    let id = e.target.id
    let obj = {}
    switch (id) {
      case 'time':
          obj.showTime = true
        break;
      case 'office':
          obj.showOffice= true
        break;
      case 'department':
          obj.showDepartment = true
        break;
      case 'category':
        obj.showCategory = true
        break;
      default:
    }
    this.setData({
      ...obj
    })
  },
  onClose () {
    let obj = {
      showTime: false,
      showDepartment: false,
      showCategory: false,
      showOffice: false
    }
    this.setData({
      ...obj
    })
  },
  onConfirmFrom (e) {
    console.log(e)
    let obj = {}
    if (e.target.id === 'time') {
      obj[e.target.id] = e.detail.value || times(e.detail)
    } else {
      obj[e.target.id] = e.detail.value
    }
    this.setData({
      ...obj
    });
    this.verifyFrom()
    this.onClose()
  },
  submit(data) {
    // 当然 promise 方式也是支持的
    wx.cloud.callFunction({
      name: 'add',
      data
    }).then(console.log)
  }
})