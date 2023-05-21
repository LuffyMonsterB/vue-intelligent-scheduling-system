<template>
  <div>
    <el-card style="margin: 30px 30px 10px 30px; border-radius: 10px">
      <div id="ganttChart"></div>
    </el-card>
    <el-card style="margin: 30px 30px 10px 30px; border-radius: 10px">资源占用情况分析</el-card>
  </div>
</template>

<script>
import { getSchedule } from "@/api/orderGantt";
import Highcharts from "highcharts";
import Gantt from "highcharts/modules/gantt";
import Dragdrop from "highcharts/modules/draggable-points";
import "highcharts/modules/exporting";
import "highcharts/modules/stock"

Gantt(Highcharts);
Dragdrop(Highcharts);

export default {
  data() {
    return {
      chartOptions: {
        chart: {
          spacingLeft: 1
        },
        title: {
          text: '智能排程系统'
        },
        plotOptions: {
          series: {
            animation: false, // Do not animate dependency connectors
            // dragDrop: {
            //   draggableX: true,// x,y轴拖拉
            //   draggableY: false,
            //   dragMinY: 0, // y轴拖拉范围
            //   dragMaxY: null,
            //   // dragPrecisionX: 1000 * 60 * 60 * 24 / 1440 // x轴最小单位一分钟
            // },
            dataLabels: { // 数据标签
              enabled: true, // 显示
              format: '{point.name}',
              style: {
                cursor: 'default',
                pointerEvents: 'none'
              }
            },
            allowPointSelect: true,
            point: {
              events: {// 点事件
                select: function (e) {
                  console.log('point click', e)
                },
                //unselect: updateRemoveButtonStatus,
                //remove: updateRemoveButtonStatus,
                drop: function (e) {
                  console.log(e.newPoint);// 拖动后新点信息
                }
              }
            }
          }
        },
        yAxis: {
          type: 'category',
          grid: {
            enabled: true,
            borderColor: 'rgba(0,0,0,0.3)',
            borderWidth: 1,
            columns: [
              {
                title: {
                  text: "资源"
                },
                labels: {
                  format: "{point.name}"
                }
              },
              // {
              //   title:{
              //     text:"开始日期"
              //   },
              //   labels:{
              //     format: '{point.start:%e. %b}'
              //   }
              // },
              // {
              //   title:{
              //     text:"结束时间"
              //   },
              //   offset: 30,
              //   labels:{
              //     format:"{point.end:%e. %b}"
              //   }
              // }
            ]
          }
        },
        xAxis: {
          currentDateIndicator: true,
        },
        tooltip: {
          xDateFormat: '%e %b %Y, %H:%M'
        },
        series: []
      },
      seriesData: [],
    }
  },
  methods: {
    parseDataToSeries(data) {
      let newData = data.map((item, index) => {
        let startDate = new Date(item.Start)
        startDate = startDate.getTime()
        let endDate = new Date(item.End)
        endDate = endDate.getTime()
        return {
          id: item.color + item.dependency,
          name: item.name,
          start: startDate + 28800000,
          end: endDate + 28800000,
          y: index,
          color: item.color,
          dependency: item.color + item.id,
        }
      })
      return newData;
    },
    drawGantt(seriesData) {
      let series = seriesData.map(item => { return { data: item } })
      Highcharts.ganttChart('ganttChart', {
        title: {
          text: '智能排程系统'
        },

        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              style: {
                cursor: 'default',
                pointerEvents: 'none'
              }
            },
            animation: false,
            dragDrop: {
              draggableX: true,
              draggableY: false,
            },
            allowPointSelect: true,
          }
        },
        navigator: {
          enabled: true,
          series: {
            type: 'gantt',
            pointPlacement: 0.5,
            pointPadding: 0.25
          },
          yAxis: {
            min: 0,
            max: 3,
            reversed: true,
            categories: []
          }
        },
        scrollbar: {
          enabled: true
        },
        rangeSelector: {
          enabled: true,
          selected: 0
        },
        xAxis: {
          tickPixelInterval: 70,

        },
        yAxis: {
          type: 'category',
          grid: {
            enabled: true,
            borderColor: 'rgba(0,0,0,0.3)',
            borderWidth: 1,
            columns: [{
              title: {
                text: '资源'
              },
              labels: {
                format: '{point.name}'
              }
            }]
          }
        },
        tooltip: {
          xDateFormat: '%e %b %Y, %H:%M'
        },
        series: series,
        exporting: {
          sourceWidth: 1000
        }
      });
    }

  },
  created() {
    getSchedule().then(res => {
      if (res.code == 200) {
        let dataList = res.data.schedule_res
        let seriesData = []
        dataList.forEach(data => {
          seriesData.push(this.parseDataToSeries(data))
        })
        this.seriesData = seriesData
        this.drawGantt(this.seriesData)
      } else {
        console.log('error', res)
      }
    })
  }
};
</script>

<style>
</style>