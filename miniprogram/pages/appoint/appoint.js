// 预约填写表单页面

// 获取一些定义好的数据，详细请移步对应文件进行查看
const { gradeInfo, departmentInfo, officeInfo, categoryInfo} = require('../../data/user.js')
// 时间格式转换工具函数 ： 时间戳转为 年月日时分秒
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
    isSendMes: false,
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

  // 下面是方法，具体哪里用到看 wxml

  // 部门选择联动
  onChange(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, departmentInfo[value[0]]);
  },
  // 性别选项改变时
  onChangeRadio(event) {
    this.setData({
      sex: event.detail
    })
  },

  // 校验表单填写是否正确
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
    // 都正确就通过， disabled = true
    this.setData({
      disabled
    })
  },

  // 点击确认预约会触发这个方法
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
    // 这里也校验了 
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
      const vm = this
      // 订阅消息模板，询问用户是否可以发送订阅通知
      // 用户同意才会提交
      wx.requestSubscribeMessage({
        tmplIds: ['eB3bNOUJAqHlROQvc-UBrpczSGFR_I2yS4CGE-t40g8'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
        success (res) {
          vm.setData({
            isSendMes: true
          })
          vm.submit(data)
        }
      })
      
    }
      
  },

  // 打开底部模态框的统一方法，如时间选择、部门选择等，在html绑定id 通过id之知道打开哪个
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

  // 关闭底部模态
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

  // 每个表单选择都通过这个方法来把值存储起来，方便后面统一提交
  onConfirmFrom (e) {
    const id = e.target.id
    wx.closeBLEConnection({
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    // 由于每个表单本质不一样，所以获取值的方式也不一样
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
    // 校验一下
    this.verifyFrom()
    // 校验通过关闭一下模态框
    this.onClose()
  },

  // 即将调用接口
  submit(data) {
    // 新增之前先查询
    this.getUser(data.no, data)
  },

  // 查询是否重复等
  getUser(no, data) {
    const vm = this
    wx.cloud.callFunction({
      name: 'getUser'
    }).then(res => {
      let fdata = res.result.data
      // 对查询出来的数据进行过滤
      // 第一个 filter 是筛选出当前账号人的记录
      // 第二个是 筛选出 不等于已完成（-2）或者已失效（-1），即得到有效的
      const resArr = fdata.filter(d => d.no === no).filter(d => d.status !== -1 && d.status !== 2)
      // 若存在有效的数据，那么就是有单在进行中，提示不要重复预约
      if (resArr.length) {
        wx.showToast({
          icon: 'none',
          title: '🤦‍♂️ 请勿重复预约~',
        })
        return
      }

      // 过滤出与这次预约时间 有交集的人数
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
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
        
    })
  },

  // 提交成功后触发发送消息
  sendMes (data) {
    wx.cloud.callFunction({
      name: 'pushMes',
      data: {
        time: times(data.time),
        name: data.name
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
          if (this.data.isSendMes) {
             // 提交成功后触发发送消息
            this.sendMes(data)
          }
          // 提交成功调转到历史页面
          // 触发父组件给他的 parentEvent 这个方法来达到跳转，具体用法请百度
          this.triggerEvent('parentEvent', 1)
        })
  }
})
