
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
    checkNo: '',
    showTime: false,
    showOffice: false,
    showCategory: false,
    showDepartment: false,
    disabled: true,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date().getTime() + 604800000,
    currentDate: new Date().getTime(),
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

    if (no.length >= 8 && no.length <= 13) {
      this.setData({
        checkNo: ''
      });
    }
    
    if (phone) {
      // 手机号的校验 
      const pattern = /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/g;
      const str = phone;
      if (pattern.test(str)) {
        this.setData({
          checkPhone: ''
        });
      }
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
    let pass = true
    if (no) {
      // 学号的校验
      if (no.length < 8 || no.length > 13) {
        this.setData({
          checkNo: '学号长度为8 ~ 13'
        });
        pass = false
      }
      const reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
  　　if(reg.test(no)){
        this.setData({
          checkNo: '学号类型不正确！'
        });
        pass = false
      }
    }

    if (phone) {
      // 手机号的校验 
      const pattern = /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/g;
      const str = phone;
      if (!pattern.test(str)) {
        this.setData({
          checkPhone: '手机号格式错误'
        });
        pass = false
      }
    }

    if (pass) {
      this.submit(data)
    }
      
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
    wx.closeBLEConnection({
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    let obj = {}
    if (id === 'timeFormat') {
      obj.time = e.detail.value || e.detail
      obj[id] = e.detail.value || times(e.detail)
    } else {e.detail.value
      obj[id] = e.detail.value || e.detail
    }
    obj[id] = obj[id].value === '' ? '' : obj[id]
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
    const vm = this
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
      }
      const count = fdata.filter(it => it.time <= data.time + 1800000 && it.time >= data.time - 1800000)
      if (count.length < 6) {
        vm.add(data)
      } else {
        wx.showModal({
          title: '提示',
          content: '预约人数大于5，是否继续？',
          success(res) {
            if (res.confirm) {
              vm.add(data)
              vm.sendMes(data)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
        
    })
  },

  sendMes (data) {
    wx.requestSubscribeMessage({
      tmplIds: ['eB3bNOUJAqHlROQvc-UBrpczSGFR_I2yS4CGE-t40g8'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
      success (res) {
        wx.cloud.callFunction({
          name: 'pushMes',
          data: {
            time: times(data.time),
            name: data.name
          }
        })
      }
    })
  },
  add (data) {
    wx.cloud.callFunction({
          name: 'add',
          data
        }).then(res => {
          wx.showToast({
            icon: 'none',
            title: '预约成功~30分钟内有效！',
          })
          this.triggerEvent('parentEvent', 1)
        })
  }
})
