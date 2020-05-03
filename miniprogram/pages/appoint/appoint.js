
const { gradeInfo, departmentInfo, officeInfo, categoryInfo} = require('../../data/user.js')
const { times } = require('../../utils/util.js')

Page({
  data: { 
    name: '',
    no: '',
    department:'',
    time: '',
    timeFormat: '',
    office: '',
    category: '',
    phone: '',
    sex: '0',
    gradeInfo: gradeInfo,
    categoryInfo: categoryInfo,
    officeInfo: officeInfo,
    checkPhone: '',
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
        values: departmentInfo[Object.keys(departmentInfo)[0]],
        className: 'column2',
        defaultIndex: 2
      }
    ]
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, departmentInfo[value[0]]);
  },
  onChangeRadio(event) {
    this.setData({
      sex: event.detail
    })
  },
  verifyFrom () {
    const {
      name,
      no,
      department,
      time,
      office,
      category,
      phone,
      sex
    } = this.data
    let disabled = true
    if (name && no && department && phone && time && office.length && category.length) {
      disabled = false
    }
    this.setData({
      disabled
    })
  },
  formSubmit (e) {
   const  {
     name,
     no,
     department,
     time,
     office,
     category,
     phone,
     sex
   } = this.data
    const data = {
        name,
        no,
        department,
        time,
        office,
        category,
        phone,
        sex}
    this.submit(data)
  },

  showPopup (e) {
    let id = e.target.id
    let obj = {}
    switch (id) {
      case 'timeFormat':
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
    const id = e.target.id
    let obj = {}
    if (id === 'timeFormat') {
      obj.time = e.detail.value || e.detail
      obj[id] = e.detail.value || times(e.detail)
    } else if (id === 'phone') {
      this.setData({
        checkPhone: ''
      });
      var pattern = /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/g;
      var str = e.detail.value;
      if (pattern.test(str)) {
        obj[id] = e.detail.value
      } else {
        if (e.detail.value) {
        this.setData({
          checkPhone: '手机号格式错误'
        });
        }
        return
      }
    } else {
      obj[id] = e.detail.value || e.detail
    }
    this.setData({
      ...obj
    });
    this.verifyFrom()
    this.onClose()
  },

  submit(data) {
    // 当然 promise 方式也是支持的
    this.getUser(data.no, data)
  },

  getUser(no, data) {
    wx.cloud.callFunction({
      name: 'getUser'
    }).then(res => {
      let fdata = res.result.data
      const resArr = fdata.filter(d => d.no === no).filter(d => d.status !== -1 && d.status !== 2)
      if (resArr.length) {
        wx.showToast({
          icon: 'none',
          title: '🤦‍♂️ 请勿重复预约~',
        })
        return
      } else {
        wx.cloud.callFunction({
          name: 'add',
          data
        }).then(res => {
          wx.showToast({
            icon: 'success',
            title: '😀 预约成功~',
          })
          this.triggerEvent('parentEvent', 1)
        })
      }
    })
  }
})