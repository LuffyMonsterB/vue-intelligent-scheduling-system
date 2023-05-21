<template>
  <div>
    <el-card style="margin: 30px 30px 10px 30px; border-radius: 10px">
      <el-row type="flex" justify="space-between">
        <el-button type="primary" class="cu-shadow" round>排程</el-button>
        <el-button type="success" class="cu-shadow" icon="el-icon-upload2">导出甘特图</el-button>
      </el-row>
    </el-card>
    <el-card style="margin: 30px 30px 10px 30px; border-radius: 10px">
      <highcharts :constructorType="'ganttChart'" class="hc" :options="chartOptions" ref="chart"></highcharts>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getSchedule } from "@/api/orderGantt";

let data_local=[]
export default {
  data() {
    const day = 1000 * 60 * 60 * 24;
    var chartOptions = {
      chart: {
        spacingLeft: 1
      },
      title: {
        text: '智能排程系统'
      },
      subtitle: {
        text: '风扇制造甘特图'
      },
      plotOptions: {
        series: {
          animation: false, // Do not animate dependency connectors
          dragDrop: {
            draggableX: true,// x,y轴拖拉
            draggableY: true,
            dragMinY: 0, // y轴拖拉范围
            dragMaxY: null,
            dragPrecisionX: day / 1440 // x轴最小单位一分钟
          },
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
                var chart = this.series.chart;
                var points = chart.getSelectedPoints();// 获取选中点信息
                let data_new=[...data_local]
                let newData = data_new.map(item => {
                      item.y = item.pro_id - 1;
                      item.Start = dayjs(item.Start).valueOf() + 28800000;
                      item.End = dayjs(item.End).valueOf() + 28800000;
                      if(item.order != points[0].order) item.dependency = 'undefined';
                      return item
                    });
                  setData(newData);
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
        categories: null,//['电动机组装线','注塑线','切割机床','网罩拼接机','焊接车间','喷漆车间','风扇整合线'],
        min: 0,
        max: null//6
      },
      xAxis: {
        currentDateIndicator: true
      },
      tooltip: {
        xDateFormat: '%a %b %d, %H:%M'
      },
      series: [{
        name: '电风扇制造排程',
        data: null
      }]
    }
    function setData(newData) {
      chartOptions.series[0].data = newData;
    }
    return {
      chartOptions,
      data_local:[],
    };
  },
  methods: {

  },
  created() {
    const self = this;
    getSchedule(1).then(function (response) {
      data_local = response.data.schedule_res;
      let data_new=[...data_local]
      var dragMaxY = 0;// y轴最大拖动位置
      var categories = [];// y轴名称表
      let newData = data_new.map(item => {
        if (item.pro_id - 0 > dragMaxY) dragMaxY = item.pro_id - 0;
        categories[item.pro_id - 1] = item.name;
        //使用UTC时间，需要增加8小时
        item.y = item.pro_id - 1
        item.Start = dayjs(item.Start).valueOf() + 28800000;
        item.End = dayjs(item.End).valueOf() + 28800000;
        item.dependency=null;
        //if(item.id == "4") item.dependency = ["1","2"];
        return item
      });
      self.chartOptions.yAxis.max = categories.length - 1;// y轴最大值
      self.chartOptions.yAxis.categories = categories;
      self.chartOptions.plotOptions.series.dragMaxY = dragMaxY;
      self.chartOptions.series[0].data = newData;
    })
      .catch(function (error) {
        console.log(error);
      });
  }
};
</script>

<style>
</style>