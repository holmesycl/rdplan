<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="编号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.iterationCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="scope">
          <router-link :to="{name:'IterationInfo',params:{iterationId:scope.row.id}}">
            <span>{{ scope.row.iterationName }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="开始时间" width="170">
        <template slot-scope="scope">
          <i v-if="scope.row.startDate != null" class="el-icon-time"></i>
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="结束时间" width="170">
        <template slot-scope="scope">
          <i v-if="scope.row.endDate != null" class="el-icon-time"></i>
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态" width="170">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusTagFilter">
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 1" size="mini" type="info" @click="handFinishIteration(scope.$index, scope.row)">
            结束
          </el-button>
          <el-button v-if="scope.row.status === 2" size="mini" type="success" @click="handStartIteration(scope.$index, scope.row)">
            开始
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


  </div>
</template>

<script>
  import {
    fetchList,
    add,
    finishIteration,
    startIteration
  } from '@/api/iteration'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'Iteration',
    props: ['planId'],
    components: {
      Pagination
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        dialogFormVisible: false,
        listQuery: {
          page: 1,
          limit: 20
        },
        temp: {
          bookName: '',
          bookUrl: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        let query = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          planId: this.planId,
          statusList: -1
        }
        fetchList(query).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handFinishIteration(index, row) {
        finishIteration({
          iterationId: row.id
        }).then(response => {
          this.getList();
          this.$notify({
            title: '结束通知',
            message: '周期结束成功。',
            type: 'success',
            duration: 2000
          })
        })
      },
      handStartIteration(index, row) {
        startIteration({
          iterationId: row.id
        }).then(response => {
          this.getList();
          this.$notify({
            title: '结束通知',
            message: '周期结束成功。',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    filters: {
      statusTagFilter: function(status) {
        const statusMap = {
          1: 'success',
          2: '',
          3: 'info'
        }
        return statusMap[status]
      },
      statusTextFilter: function(status) {
        const statusMap = {
          1: '进行中',
          2: '未开始',
          3: '已结束'
        }
        return statusMap[status];
      }
    }
  }
</script>

<style scoped>

</style>
