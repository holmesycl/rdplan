<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input size="small" v-model="listQuery.bookName" placeholder="图书名称" style="width: 260px;" class="filter-item"
        @keyup.enter.native="handleQuery" />
      <el-select size="small" v-model="listQuery.status" multiple placeholder="状态" clearable style="width: 260px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <el-button v-waves size="small" class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search"
        @click="handleQuery">
        查询
      </el-button>

      <el-button class="filter-item" size="small" style="margin-left: 10px;" type="info" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>

    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="图书ID" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.bookId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图书名称">
        <template slot-scope="scope">
          <a :href="scope.row.bookUrl" target="_blank" class="link-type">
            <span>{{ scope.row.bookName }}</span>
          </a>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="图书别名">
        <template slot-scope="scope">
          <span>{{ scope.row.alias }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="出版社">
        <template slot-scope="scope">
          <span>{{ scope.row.publishingHouse }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="出版时间">
        <template slot-scope="scope">
          <span>{{ scope.row.publishDate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80" align="center" label="页数">
        <template slot-scope="scope">
          <span>{{ scope.row.pages }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="价格">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="添加时间" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="状态" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusTagFilter">
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handCrawBook(scope.$index, scope.row)">
            初始化
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="添加图书" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="图书名称" prop="bookName">
          <el-input v-model="temp.bookName" />
        </el-form-item>
        <el-form-item label="图书链接" prop="bookUrl">
          <el-input v-model="temp.bookUrl" />
        </el-form-item>
        <el-form-item label="图书别名" prop="alias">
          <el-input v-model="temp.alias" />
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
    add,
    crawBook
  } from '@/api/book'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'listBook',
    components: {
      Pagination
    },
    filters: {
      statusTagFilter(status) {
        const statusMap = {
          1: 'info',
          2: 'success',
          3: 'danger'
        }
        return statusMap[status]
      },
      statusTextFilter(status) {
        const statusMap = {
          1: '未入库',
          2: '已入库',
          3: '入库失败'
        }
        return statusMap[status];
      }
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
          status: [],
          bookName: ''
        },
        statusOptions: [{
            label: '未入库',
            value: 1
          },
          {
            label: '已入库',
            value: 2
          },
          {
            label: '入库失败',
            value: 3
          }
        ],
        temp: {
          bookName: '',
          bookUrl: '',
          alias: ''
        },
        rules: {
          bookUrl: [{
            required: true,
            message: '图书链接不能为空。',
            trigger: 'change'
          }]
        },
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
          statusList: this.listQuery.status.join(','),
          bookName: this.listQuery.bookName,
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
          alias: ''
        }
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            add(this.temp).then(() => {
              this.getList();
              this.dialogFormVisible = false
              this.$notify({
                title: '图书添加通知',
                message: '图书添加成功。',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handCrawBook(index, item) {
        crawBook({
          bookId: item.bookId
        }).then(response => {
          this.getList();
          this.$notify({
            title: '初始化通知',
            message: '图书初始化成功。',
            type: 'success',
            duration: 2000
          })
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
