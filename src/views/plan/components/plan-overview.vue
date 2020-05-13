<template>
  <div class="app-container">
    <el-calendar :value="new Date()" :range="[iteration.startDate, iteration.endDate]">
      <template #dateCell="{data}">
        <b>{{ data.day.split('-').slice(1).join('-') }}</b>
        <template v-if="data.isSelected">
          <el-divider direction="vertical"></el-divider>
          <i class="el-icon-s-flag">{{iteration.duration}}天</i>
        </template>

        <el-divider>
          <el-tag size="small" type="success" effect="plain">{{ iteration.iterationCode }}</el-tag>
        </el-divider>

      </template>
    </el-calendar>

    <el-divider></el-divider>

    <div class="chart-container">
      <div id="up" style="width: 100%;height:100%;"></div>
    </div>

    <el-divider></el-divider>

    <div class="chart-container">
      <div id="pr" style="width: 100%;height:100%;"></div>
    </div>

  </div>
</template>

<script>
  import {
    current
  } from '@/api/iteration'
  import {
    userPlanChart,
    planReadingChart
  } from '@/api/echarts'
  import echarts from 'echarts'
  import resize from '@/components/Charts/mixins/resize'
  export default {
    mixins: [resize],
    name: 'PlanOverview',
    props: ['planId'],
    components: {

    },
    data() {
      return {
        iteration: null
      }
    },
    created() {
      this.getCurIteration()
      this.initUserPlanChart()
      this.initPlanReadingChart()
    },
    methods: {
      getCurIteration: function() {
        current({
          planId: this.planId
        }).then(response => {
          this.iteration = response.data;
        })
      },
      initUserPlanChart: function() {
        userPlanChart({
          planId: this.planId
        }).then(response => {
          let option = response.data
          let userPlanChart = echarts.init(document.getElementById('up'))
          userPlanChart.setOption(option)
        })
      },
      initPlanReadingChart: function() {
        planReadingChart({
          planId: this.planId
        }).then(response => {
          let option = response.data
          let userPlanChart = echarts.init(document.getElementById('pr'))
          userPlanChart.setOption(option)
        })
      }
    }

  }
</script>

<style>
  .chart-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }
</style>
