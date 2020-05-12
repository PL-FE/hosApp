// 初始化图表
import * as echarts from '../ec-canvas/echarts.js';
const { gradeInfo, departmentInfo, officeInfo, categoryInfo } = require('../data/user.js')

function init (ecComponent, option) {
  ecComponent.init((canvas, width, height) => {
    // 获取组件的 canvas、width、height 后的回调函数
    // 在这里初始化图表
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    chart.setOption(option);

    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return chart;
  });
}
// 处理横纵坐标数据
function hybridData(data, type) {
  let arr = []
  let mmArr = []
  let ggArr = []
  data.map(item => {
    if (type === 'department') {
      let tempArr = Object.keys(departmentInfo)
      tempArr.forEach((it, i) => {
          mmArr[i] = 0,
          ggArr[i] = 0
        data.forEach(d => {
          if (d.department[0] === it) {
            if (d.sex === "0") {
              ggArr[i] = ggArr[i] + 1
            } else {
              mmArr[i] = mmArr[i] + 1
            }
          }
        })
      arr = [ggArr,mmArr]
      })
    } else {
      arr.push(item[type])
    }
  })
  return arr;
}
//画图
function echartlinefn (color, xAxis, data, sortype, tooltipName) {
  xAxis = xAxis.map(it => it.split(' ')[0])
  const res = xAxis.reduce((prev, curr)=> {
    if (curr in prev) {
      prev[curr]++;
    } else {
      prev[curr] = 1;
    }
    return prev;
  },{})
  xAxis = Object.keys(res)
  //color:颜色, xAxis:x轴数据, data:数据, sortype:获取Y轴区间类型
  // y轴最小值
  let min = 0;
  // let min = Math.min(...hybridData(data, sortype));
  // y轴最大值
  let max = Math.max(...Object.values(res));
  max = max == 0 ? 4 : max
  // y轴刻度间隔
  let yInterval = max >= 4 ? parseInt((max - min) / 4) : 1;
  // 配置
  let option = {
    // 折线图颜色
    color: 'red',
    // grid 为直角坐标系内绘图网格,控制图表摆放位置上
    grid: {
      top: '4%',
      left: '8%',
      right: '8%',
      bottom: '4%',
      containLabel: true
    },
    // 悬浮框
    tooltip: {
      show: true,
      trigger: "axis",
     
      formatter: function (params) {
        let tip = `${params[0].name}\n`;
        for (let i = 0; i < params.length; i++) {
          tip += `{marker${params[i].seriesIndex}at0|} ${params[i].seriesName}: ${params[i].value}\n`;
        }
        return tip;
      }
    },
    // x轴
    xAxis: {
      type: 'category',
      // 坐标轴两边留白策略
      boundaryGap: true,
      // show: false,
      data: xAxis,
      // x轴线
      axisLine: {
        show: false, //是否显示x轴线
        lineStyle: {
          color: '#ECF2FB', // x坐标轴的轴线颜色
          width: 1, //这里是坐标轴的宽度,可以去掉
        }
      },
      // 坐标轴刻度
      axisTick: {
        show: false
      },
      // 单轴刻度标签的相关设置
      axisLabel: {
        // rotate: 45,
        fontSize: 10,
        textStyle: { //x轴字体样式
          margin: 25,
          color: '#9CA5B1'
        },
        formatter: function (value) {
          return value.split("-").join("/").split(" ")[0];
        }  
      }
    },
    yAxis: {
      x: 'center',
      // show: false,
      type: 'value',
      minInterval: 1,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false, //是否显示y轴
        lineStyle: {
          color: '#ECF2FB', // y坐标轴的轴线颜色
          width: 1, //这里是坐标轴的宽度,可以去掉
        }
      },
      splitLine: {
        show: true, // 网格线是否显示
        //  改变样式
        lineStyle: {
          color: '#ECF2FB', // 修改网格线颜色
          type: 'dotted', //网格线的类型
          width: 1,
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#9CA5B1'
        }
      },
      min: min,
      max: max,
      interval: yInterval
    },
    series: [{
      name: tooltipName,
      type: 'line',
      smooth: true,
      color: ['#4EBADB'],
      data: Object.values(res),
      itemStyle: {
        normal: { 
          color: '#2f4554',
          borderColor: '#2f4554',
          // label: { show: true },
          lineStyle: {
            width: 2,
            type: 'solid',  //'dotted'虚线 'solid'实线
            color: '#2f4554'
          }
        }
      }
    }]
  };
  return option
}

function echartBarfn(color, xAxis, data, sortype, tooltipName) {
  xAxis[0].push(xAxis[0].reduce((p, c) => p + c, 0))
  xAxis[1].push(xAxis[1].reduce((p, c) => p + c, 0))
  const yData = Object.keys(departmentInfo)
  yData.push('总人数')
  // 配置
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['女', '男'],
      x: 'right',
      //垂直安放位置，默认为全图顶端，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）  
      y: '20px',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      // 坐标轴两边留白策略
      boundaryGap: true,
      // show: false,
    
    },
    yAxis: {
      type: 'category',
      data: yData,
      // x轴线
      axisLine: {
        show: false, //是否显示x轴线
        lineStyle: {
          color: '#ECF2FB', // x坐标轴的轴线颜色
          width: 1, //这里是坐标轴的宽度,可以去掉
        }
      },
      // 坐标轴刻度
      axisTick: {
        show: false
      },
      // 单轴刻度标签的相关设置
      axisLabel: {
        // rotate: 45,
        fontSize: 10,
        textStyle: { //x轴字体样式
          margin: 25,
          color: '#9CA5B1'
        }
      }
    },
    series: [
      {
        name: '男',
        type: 'bar',
        data: xAxis[1]
      },
      {
        name: '女',
        type: 'bar',
        data: xAxis[0]
      }
    ]
  }
  return option
}

function echartPiefn(color, xAxis, data, sortype, tooltipName) {
  // 配置
  const led = categoryInfo
  let categoryres = data.map(it => it.category).reduce((pre, cur)=>{
    pre[cur] = pre[cur] ? pre[cur] + 1 : 1
    return pre
  },{})
  let resData = []
  Object.entries(categoryres).forEach(it => {
    resData.push({
      name: it[0],
      value: it[1]
    })
  })
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: `{a} \n{b} : {c} ({d}%)`
    },
    legend: {
      orient: 'horizontal',
      left: 'center',
      y: '20px',
      data: categoryInfo
    },
    series: [
      {
        name: '类型',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: resData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return option
}

export {
  echartlinefn,
  init,
  hybridData,
  echartPiefn,
  echartBarfn
}