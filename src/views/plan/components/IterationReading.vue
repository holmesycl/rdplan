<template>
  <div class="app-container">

    <el-table v-loading="listLoading" stripe :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="成员名称" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.alias }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图书名称" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.bookName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图书信息" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.author }} / {{ scope.row.publishingHouse }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="当前状态" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusTagFilter">
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 1 || scope.row.status === 3" size="mini" type="info" @click="handReading(scope.$index, scope.row)">
            在读
          </el-button>
          <el-button v-if="scope.row.status === 1 || scope.row.status === 2" size="mini" type="success" @click="handFinish(scope.$index, scope.row)">
            已读
          </el-button>
          <el-button v-if="scope.row.status === 2 || scope.row.status === 3" size="mini" type="warning" @click="handUnread(scope.$index, scope.row)">
            未读
          </el-button>
          <el-button icon="el-icon-circle-plus" type="danger" size="mini" @click="handAddPlanBook(scope.$index, scope.row)">
          </el-button>
          <el-button icon="el-icon-remove" type="danger" size="mini" @click="handDel(scope.$index, scope.row)">
          </el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
  import {
    listAll,
    reading,
    finish,
    unread,
    del
  } from '@/api/iteration-reading'
  import {
    fetchPlan
  } from '@/api/iteration'
  import {
    addPlanBook
  } from '@/api/planBook'
  import waves from '@/directive/waves' // waves directive

  export default {
    name: 'IterationReading',
    props: ['iterationId'],
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        plan: null
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        if (this.plan != null) {
          this.fetchList();
        } else {
          fetchPlan({
            iterationId: this.iterationId
          }).then(response => {
            this.plan = response.data
            this.fetchList();
          })
        }
      },
      fetchList() {
        this.listLoading = true
        let query = {
          planId: this.plan.planId,
          iterationId: this.iterationId
        }
        listAll(query).then(response => {
          this.list = response.data
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false;
        })
      },
      handReading(index, row) {
        this.listLoading = true
        reading({
          id: row.id
        }).then(response => {
          this.getList();
          this.$notify({
            title: '在读通知',
            message: '在读设置成功。',
            type: 'success',
            duration: 2000
          })
        }).catch(error => {
          this.listLoading = false;
        })
      },
      handFinish(index, row) {
        this.listLoading = true
        finish({
          id: row.id
        }).then(response => {
          this.getList();
          this.$notify({
            title: '已读通知',
            message: '已读设置成功。',
            type: 'success',
            duration: 2000
          })
        }).catch(error => {
          this.listLoading = false;
        })
      },
      handUnread(index, row) {
        this.listLoading = true
        unread({
          id: row.id
        }).then(response => {
          this.getList();
          this.$notify({
            title: '未读通知',
            message: '未读设置成功。',
            type: 'success',
            duration: 2000
          })
        }).catch(error => {
          this.listLoading = false;
        })
      },
      handDel(index, row) {
        this.listLoading = true
        del({
          id: row.id
        }).then(response => {
          this.getList();
          this.$notify({
            title: '移除通知',
            message: '移除成功。',
            type: 'success',
            duration: 2000
          })
        }).catch(error => {
          this.listLoading = false;
        })
      },
      handAddPlanBook(index, row) {
        this.listLoading = true
        var planBook = {
          planId: row.planId,
          bookId: row.bookId
        }
        addPlanBook(planBook).then(response => {
          this.getList();
          this.$notify({
            title: '添加通知',
            message: '图书添加到计划参考图书成功。',
            type: 'success',
            duration: 2000
          })
        }).catch(error => {
          this.listLoading = false;
        })
      }
    },
    filters: {
      statusTagFilter: function(status) {
        const statusMap = {
          1: 'warning',
          2: 'info',
          3: 'success'
        }
        return statusMap[status]
      },
      statusTextFilter: function(status) {
        const statusMap = {
          1: '未读',
          2: '在读',
          3: '已读'
        }
        return statusMap[status];
      }
    }
  }
</script>

<style scoped>

</style>
