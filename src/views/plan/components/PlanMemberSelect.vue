<template>
  <el-transfer v-model="value" :data="data" @change="handleChange"
  :titles="['计划成员', '已选择']" filterable
  ></el-transfer>
</template>

<script>
  import {
    fetchAll
  } from '@/api/plan-member'
  export default {
    name: 'PlanMemberSelect',
    props: ['planId', 'value', 'disabledItems'],
    data() {
      return {
        data: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(){
        fetchAll({
          planId: this.planId
        }).then(response => {
          let planMembers = response.data
          planMembers.forEach((item, index) => {
            let disabled =
              this.data.push({
                label: item.alias,
                key: item.userId,
                disabled: this.disabledItems.includes(item.userId) ? true : false
              })
          })
        })
      },
      handleChange(value, direction, movedKeys) {
        this.$emit('change', value)
      }
    }
  }
</script>

<style>
</style>
