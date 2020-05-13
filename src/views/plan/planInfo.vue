<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="概述" name="overview">
        <plan-overview v-if="tabs['overview']" v-bind:planId="$route.params.planId"></plan-overview>
      </el-tab-pane>
      <el-tab-pane label="成员" name="member">
        <plan-member v-if="tabs['member']" v-bind:planId="$route.params.planId">成员</plan-member>
      </el-tab-pane>
      <el-tab-pane label="图书" name="book">
        <list-plan-book v-if="tabs['book']" v-bind:planId="$route.params.planId">图书</list-plan-book>
      </el-tab-pane>
      <el-tab-pane label="周期" name="iteration">
        <iteration v-if="tabs['iteration']" v-bind:planId="$route.params.planId">周期</iteration>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import listPlanBook from './components/listPlanBook';
  import PlanMember from './components/PlanMember';
  import Iteration from './components/Iteration';
  import PlanOverview from './components/plan-overview'

  export default {
    name: 'planInfo',
    components: {
      listPlanBook,
      PlanMember,
      Iteration,
      PlanOverview
    },
    data() {
      return {
        activeName: 'overview',
        tabs: {
          overview: true,
          member: false,
          book: false,
          iteration: false,
        }
      };
    },
    methods: {
      handleClick(tab, event) {
        if (tab.active) {
          this.showTabContent(tab.name);
        }
      },
      showTabContent(tabName) {
        for (let name in this.tabs) {
          if(name === tabName){
            this.tabs[name] = true;
          }else{
            this.tabs[name] = false;
          }
        }
      }
    }
  };
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
