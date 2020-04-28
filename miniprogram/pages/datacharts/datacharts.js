//index.js
//获取应用实例
const app = getApp()
import { echartlinefn, init, hybridData } from '../../utils/common';

Page({
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true,
      // disableTouch: true
    },
    color: '#4EBADB',
    chartData: [
      {
        "date": "2020-03-18",
        "show": 19,
        "click": 0,
        "hk_count": "0"
      },
      {
        "date": "2020-03-19",
        "show": 26,
        "click": 0,
        "hk_count": "0"
      },
      {
        "date": "2020-03-20",
        "show": 40,
        "click": 1,
        "hk_count": "0"
      },
      {
        "date": "2020-03-21",
        "show": 55,
        "click": 1,
        "hk_count": "0"
      },
      {
        "date": "2020-03-22",
        "show": 19,
        "click": 0,
        "hk_count": "0"
      },
      {
        "date": "2020-03-23",
        "show": 14,
        "click": 1,
        "hk_count": "0"
      },
      {
        "date": "2020-03-24",
        "show": "0",
        "click": "0",
        "hk_count": "0"
      }
    ]
  },
  onLoad: function () {
    init(
      this.selectComponent('#ec_line'),
      echartlinefn(
        this.data.color,
        hybridData(this.data.chartData, 'date'),
        this.data.chartData,
        'show',
        '曝光量'
      )
    );
  }
})
