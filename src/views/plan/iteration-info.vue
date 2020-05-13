<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="成员" name="member">
        <iteration-member v-if="tabs['member']" v-bind:iterationId="$route.params.iterationId">
        </iteration-member>
      </el-tab-pane>
      <el-tab-pane label="阅读" name="read">
        <iteration-reading v-if="tabs['read']" v-bind:iterationId="$route.params.iterationId">
        </iteration-reading>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import IterationMember from './components/IterationMember';
  import IterationReading from './components/IterationReading';
  export default {
    name: 'planInfo',
    components: {
      IterationMember,
      IterationReading
    },
    data() {
      return {
        activeName: 'read',
        tabs: {
          member: false,
          read: true
        }
      }
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
