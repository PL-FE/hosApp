// components/chartsTimeUser/chartsTimeUser.js
import { echartlinefn, init, hybridData } from '../../utils/common';
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    init () {
      init(
        this.selectComponent('#ec_line'),
        echartlinefn(
          this.data.color,
          hybridData(this.data.userList, 'time'),
          this.data.userList,
          'countActivate',
          '人数'
        )
      );
    }
  }
})
