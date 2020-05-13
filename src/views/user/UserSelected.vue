<template>
  <div class="app-container">
    <div style="margin-bottom: 10px;">
      <el-input v-model="listQuery.alias" placeholder="用户名称" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleQuery" />

      <el-button style="margin-left: 20px;" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleQuery">
        查询
      </el-button>
    </div>


    <el-table v-loading="listLoading" stripe :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="用户名" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.alias }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button :type="type(scope.row.userId)" :icon="icon(scope.row.userId)" :disabled="disabled(scope.row.userId)"
            size="mini" @click="select(scope.$index, scope.row)">
            添加
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
  import {
    fetchList
  } from '@/api/user'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'UserSelected',
    props: ['selected'],
    components: {
      Pagination
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          alias: ''
        },
        value: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleQuery() {
        this.getList();
      },
      select(index, item) {
        let userId = item.userId;
        if (this.value.indexOf(userId) === -1) {
          this.value.push(item.userId);
        }
        this.$emit('change', this.value)
      },
      disabled: function(userId) {
        return this.value.indexOf(userId) > -1 ||
          (this.selected != null && this.selected.indexOf(userId) > -1)
      },
      icon: function(userId) {
        return (this.value.indexOf(userId) === -1 &&
            (this.selected != null && this.selected.indexOf(userId) === -1)
          )

          ?
          'el-icon-circle-plus' : 'el-icon-success'
      },
      type: function(userId) {
        return (this.value.indexOf(userId) === -1 &&
          (this.selected != null && this.selected.indexOf(userId) === -1)

        ) ? 'primary' : 'success'
      }
    }
  }
</script>

<style>
</style>
