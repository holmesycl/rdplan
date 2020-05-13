<template>
  <div class="app-container">
    <el-button @click="handleCreate" icon="el-icon-user-solid" type="primary" size="small" style="margin-bottom: 20px;">添加成员</el-button>
    <el-table v-loading="listLoading" stripe :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="成员名称">
        <template slot-scope="scope">
          <span>{{ scope.row.alias }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="加入时间" width="200">
        <template slot-scope="scope">
          <i v-if="scope.row.joinDate != null" class="el-icon-time"></i>
          <span>{{ scope.row.joinDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="上次退出时间" width="150">
        <template slot-scope="scope">
          <i v-if="scope.row.exitDate != null" class="el-icon-time"></i>
          <span>{{ scope.row.exitDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="当前状态" width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusTagFilter">
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="170">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 1" size="mini" type="danger" @click="handExitPlan(scope.$index, scope.row)">
            退出
          </el-button>

          <el-button v-if="scope.row.status === 2" size="mini" type="success" @click="handJoinPlan(scope.$index, scope.row)">
            继续参与
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="addPlanMemberDialogVisible">
      <user-selected v-bind:selected="selected" v-if="addPlanMemberDialogVisible" @change="handUserSelect">

      </user-selected>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPlanMemberDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handAddPlanMembers">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    fetchList,
    joinPlan,
    exitPlan,
    addPlanMembers
  } from '@/api/plan-member'
  import UserSelected from '../../user/UserSelected'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'PlanMember',
    props: ['planId'],
    components: {
      Pagination,
      UserSelected
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        addPlanMemberDialogVisible: false,
        listQuery: {
          page: 1,
          limit: 20
        },
        selected: [],
        value: []
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
          this.selected.splice(0, this.selected.length)
          if (this.list) {
            this.list.forEach((item, index) => {
              if (item.status === 1) {
                this.selected.push(item.userId);
              }
            })
          }
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleCreate() {
        this.addPlanMemberDialogVisible = true;
      },
      handExitPlan(index, row) {
        let planMember = {
          planId: row.planId,
          userId: row.userId
        }
        exitPlan(planMember).then(response => {
          this.getList();
          this.$notify({
            title: '退出通知',
            message: '退出计划成功。',
            type: 'success',
            duration: 2000
          })
        })
      },
      handJoinPlan(index, row) {
        let planMember = {
          planId: row.planId,
          userId: row.userId
        }
        joinPlan(planMember).then(response => {
          this.getList();
          this.$notify({
            title: '参与通知',
            message: '参与计划成功。',
            type: 'success',
            duration: 2000
          })
        })
      },
      handUserSelect(value) {
        this.value = value
      },
      handAddPlanMembers() {
        let planMember = {
          planId: this.planId,
          members: this.value.join(',')
        }
        addPlanMembers(planMember).then(response => {
          this.addPlanMemberDialogVisible = false
          this.getList();
          this.$notify({
            title: '成员添加通知',
            message: '成员添加成功。',
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
          2: 'danger'
        }
        return statusMap[status]
      },
      statusTextFilter: function(status) {
        const statusMap = {
          1: '参与中',
          2: '已退出'
        }
        return statusMap[status];
      }
    }
  }
</script>

<style scoped>

</style>
