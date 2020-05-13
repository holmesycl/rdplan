<template>
  <el-transfer v-model="value" :data="data" @change="handleChange" :titles="['计划成员', '已选择']" filterable></el-transfer>
</template>

<script>
  import {
    fetchAll
  } from '@/api/planBook'
  export default {
    name: 'PlanBookSelect',
    props: ['planId', 'iterationId', 'userId'],
    data() {
      return {
        data: [],
        value: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        fetchAll({
          planId: this.planId
        }).then(response => {
          let planBooks = response.data
          planBooks.forEach((item, index) => {
            this.data.push({
              label: item.bookName,
              key: item.bookId
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
