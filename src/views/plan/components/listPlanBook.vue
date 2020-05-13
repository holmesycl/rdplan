<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
      </el-table-column>


      <el-table-column align="center" label="图书名称" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.bookName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="作者" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="出版社" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.publishingHouse }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="出版时间" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.publishDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="价格" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="添加时间" width="120">

        <template slot-scope="scope">
          <i v-if="scope.row.addDate != null" class="el-icon-time"></i>
          <span>{{ scope.row.addDate }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


  </div>
</template>

<script>
  import {
    fetchList,
    add
  } from '@/api/planBook'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'listPlanBook',
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
          statusList: 1
        }
        fetchList(query).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
