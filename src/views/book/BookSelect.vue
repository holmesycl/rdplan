<template>
  <el-transfer v-model="value" :data="data" @change="handleChange" :titles="['图书', '已选择']" filterable></el-transfer>
</template>

<script>
  import {
    fetchAll
  } from '@/api/book'
  export default {
    name: 'BookSelect',
    data() {
      return {
        value: [],
        data: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        fetchAll().then(response => {
          let books = response.data
          books.forEach((item, index) => {
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
