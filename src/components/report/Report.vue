<template>
  <div>
    <h3>数据报表</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>
    
<script>
//导入echarts
import * as echarts from 'echarts'
//导入lodash
import _ from 'lodash'

export default {
  data() {
    return {
      //需要跟请求的折线图数据合并的options
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  //页面一加载就调用该函数，这里还没有加载出HTML页面，即无法获取里面的内容或值
  created() {},
  //在页面dom元素加载完毕之后执行的钩子函数mounted，多用于echart表
  mounted() {
    this.chart()
  },
  methods: {
    async chart() {
      //发送请求获取折线图数据
      const { data: res } = await this.$http.get('reports/type/1')

      if (res.meta.status !== 200) {
        return this.$message.error('获取折线图数据失败')
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main'))
      //合并res.data和this.options
      const result = _.merge(res.data, this.options)

      // 使用获取的数据展示图表
      myChart.setOption(result)
    },
  },
}
</script>

<style lang="less" scoped>
</style>