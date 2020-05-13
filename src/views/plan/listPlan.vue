<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="计划ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.planId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="计划名称">
        <template slot-scope="scope">
          <router-link :to="{name:'PlanInfo',params:{planId:scope.row.planId}}">
            <span>{{ scope.row.planName }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="计划描述">
        <template slot-scope="scope">
          <span>{{ scope.row.planDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="发起人">
        <template slot-scope="scope">
          <span>{{ scope.row.sponsor }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="开始时间" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="结束时间" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="图书名称" prop="bookName">
          <el-input v-model="temp.bookName" />
        </el-form-item>
        <el-form-item label="图书链接" prop="bookUrl">
          <el-input v-model="temp.bookUrl" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    fetchList,
    add
  } from '@/api/plan'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'listPlan',
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
          limit: 20,
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
        }
        fetchList(query).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleQuery() {
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      resetTemp() {
        this.temp = {
          bookName: '',
          bookUrl: '',
        }
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            add(this.temp).then(() => {
              this.getList();
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
