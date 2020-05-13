<template>
  <div class="app-container">

    <el-button @click="handleCreate" icon="el-icon-user-solid" type="primary" size="small" style="margin-bottom: 20px;">添加成员</el-button>

    <el-table v-loading="listLoading" stripe :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="参与成员" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.alias }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="参与时间" width="200">
        <template slot-scope="scope">
          <i v-if="scope.row.joinDate != null" class="el-icon-time"></i>
          <span>{{ scope.row.joinDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="上次退出时间" width="200">
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

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <template v-if="scope.row.status === 1">
            <el-button size="mini" type="danger" @click="handExitIteration(scope.$index, scope.row)">
              退出
            </el-button>
            <el-button size="mini" type="info" @click="handAddBook(scope.$index, scope.row)">
              添加图书
            </el-button>
          </template>
          <el-button v-if="scope.row.status === 2" size="mini" type="success" @click="handJoinIteration(scope.$index, scope.row)">
            继续参与
          </el-button>

        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible">
      <plan-member-select v-if="dialogFormVisible" v-bind:planId="plan.planId" v-bind:disabledItems="value"
        v-bind:value="[]" @change="handSelect">

      </plan-member-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="addIterationBookDialogVisible">
      <book-select v-if="addIterationBookDialogVisible" @change="handBookSelect">

      </book-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addIterationBookDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addIterationBook()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    fetchList,
    add,
    joinIteration,
    exitIteration,
    membersJoinIteration
  } from '@/api/iteration-member'
  import {
    fetchPlan
  } from '@/api/iteration'
  import {
    addMemberIterationReading
  } from '@/api/iteration-reading'
  import PlanMemberSelect from './PlanMemberSelect'
  import BookSelect from '@/views/book/BookSelect.vue'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'IterationMember',
    props: ['iterationId'],
    components: {
      Pagination,
      PlanMemberSelect,
      BookSelect
    },
    data() {
      return {
        list: null,
        total: 0,
        plan: null,
        listLoading: true,
        dialogFormVisible: false,
        addIterationBookDialogVisible: false,
        listQuery: {
          page: 1,
          limit: 20
        },
        value: [],
        selectedMembers: [],
        selectedBooks: [],
        addBookUser: 0
      }
    },
    created() {
      this.getPlan()
      this.getList()
    },
    methods: {
      getPlan() {
        fetchPlan({
          iterationId: this.iterationId
        }).then(response => {
          this.plan = response.data
        })
      },
      getList() {
        this.listLoading = true
        let query = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          iterationId: this.iterationId,
          statusList: -1
        }
        fetchList(query).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          if(this.value !=null){
            this.value.splice(0, this.value.length)
          }
          if(this.list != null){
            this.list.forEach((item, index) => {
              if (item.status === 1) {
                this.value.push(item.userId)
              }
            })
          }
          this.listLoading = false
        })
      },
      handJoinIteration(index, row) {
        var iterationMember = {
          iterationId: this.iterationId,
          userId: row.userId
        }
        joinIteration(iterationMember).then(response => {
          this.getList();
          this.$notify({
            title: '参与通知',
            message: '周期参与成功。',
            type: 'success',
            duration: 2000
          })
        })
      },
      handExitIteration(index, row) {
        var iterationMember = {
          iterationId: row.iterationId,
          userId: row.userId
        }
        exitIteration(iterationMember).then(response => {
          this.getList();
          this.$notify({
            title: '退出通知',
            message: '周期退出成功。',
            type: 'success',
            duration: 2000
          })
        })
      },
      handSelect(value) {
        this.selectedMembers = value;
      },
      handleCreate() {
        this.dialogFormVisible = true;
      },
      createData() {
        let iterationMembers = {
          planId: this.plan.planId,
          iterationId: this.iterationId,
          members: this.selectedMembers.join(',')
        }
        membersJoinIteration(iterationMembers).then(response => {
          this.getList();
          this.$notify({
            title: '参加通知',
            message: '阅读周期参与成功。',
            type: 'success',
            duration: 2000
          })
        })
        this.dialogFormVisible = false;
      },
      handAddBook(index, row) {
        this.addIterationBookDialogVisible = true
        this.addBookUser = row.userId;
      },
      addIterationBook() {
        let memberIteraionReading = {
          planId: this.plan.planId,
          iterationId: this.iterationId,
          userId: this.addBookUser,
          books: this.selectedBooks.join(',')
        }
        addMemberIterationReading(memberIteraionReading).then(response => {
          this.getList();
          this.$notify({
            title: '添加通知',
            message: '用户本周期阅读图书添加成功。',
            type: 'success',
            duration: 2000
          })
        })
        this.addIterationBookDialogVisible = false;
      },
      handBookSelect(value) {
        this.selectedBooks = value;
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
