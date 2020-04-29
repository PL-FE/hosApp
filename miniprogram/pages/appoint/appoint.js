
const { gradeInfo, department, office, category} = require('../../data/user.js')
Page({
  data: { 
    no: '',
    name: '',
    department:'',
    gradeInfo: gradeInfo,
    category: category,
    office: office,
    showTime: false,
    showOffice: false,
    showCategory: false,
    showDepartment: false,
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
    departmentInfo: [
      {
        values: Object.keys(department),
        className: 'column1'
      },
      {
        values: department['浙江'],
        className: 'column2',
        defaultIndex: 2
      }
    ]
  },
  formSubmit (e) {
    console.log(e)
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
  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },
  onChangeDepartment (e) {
    console.log(e)
  }
})