<template>
    <div class="book-management">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>书籍管理</span>
            <div class="header-actions">
              <el-input
                v-model="searchQuery"
                placeholder="搜索书名/作者"
                clearable
                style="width: 300px"
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              >
                <template #append>
                  <el-button icon="el-icon-search" @click="handleSearch" />
                </template>
              </el-input>
            </div>
          </div>
        </template>
  
        <el-table 
          :data="books" 
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column prop="title" label="书名" />
          <el-table-column prop="author" label="作者" />
          <el-table-column label="推荐人">
            <template #default="{row}">
              {{ row.recommender_name || '系统' }}
            </template>
          </el-table-column>
          <el-table-column label="封面" width="120">
            <template #default="{row}">
              <el-image 
                :src="row.cover_url" 
                fit="cover" 
                style="width: 60px; height: 80px"
                :preview-src-list="[row.cover_url]"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><el-icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{row}">
              <el-tag :type="row.status === 'approved' ? 'success' : 'warning'">
                {{ formatStatus(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="{row}">
              <el-button 
                size="mini" 
                type="success"
                @click="handleApprove(row.id)"
                v-if="row.status !== 'approved'"
              >
                通过
              </el-button>
              <el-button 
                size="mini" 
                type="danger"
                @click="handleDelete(row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <el-pagination
          class="pagination"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </el-card>
    </div>
  </template>
  
  <script>
  import { Picture as ElIconPicture } from '@element-plus/icons-vue'
  import { mapState, mapActions } from 'vuex'
  
  export default {
    name: 'BookManagement',
    components: {
      ElIconPicture
    },
    data() {
      return {
        searchQuery: '',
        currentPage: 1,
        pageSize: 10
      }
    },
    computed: {
      ...mapState('admin', ['books', 'loading']),
      total() {
        return this.books.length // 实际项目应从API获取
      }
    },
    methods: {
      ...mapActions('admin', ['fetchBooks', 'approveBook', 'deleteBook']),
      
      formatStatus(status) {
        const statusMap = {
          pending: '待审核',
          approved: '已通过',
          rejected: '已拒绝'
        }
        return statusMap[status] || status
      },
      
      handleSearch() {
        this.currentPage = 1
        this.fetchBooks({
          query: this.searchQuery,
          page: this.currentPage,
          pageSize: this.pageSize
        })
      },
      
      handleSizeChange(size) {
        this.pageSize = size
        this.fetchBooks({
          query: this.searchQuery,
          page: this.currentPage,
          pageSize: this.pageSize
        })
      },
      
      handlePageChange(page) {
        this.currentPage = page
        this.fetchBooks({
          query: this.searchQuery,
          page: this.currentPage,
          pageSize: this.pageSize
        })
      },
      
      async handleApprove(bookId) {
        try {
          await this.approveBook(bookId)
          this.$message.success('书籍已通过审核')
        } catch (error) {
          this.$message.error(error.message)
        }
      },
      
      async handleDelete(bookId) {
        try {
          await this.$confirm('确定删除此书籍吗？', '警告', {
            type: 'warning'
          })
          await this.deleteBook(bookId)
          this.$message.success('书籍已删除')
        } catch (error) {
          if (error !== 'cancel') {
            this.$message.error(error.message)
          }
        }
      }
    },
    created() {
      this.fetchBooks()
    }
  }
  </script>
  
  <style scoped>
  .image-error {
    width: 60px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    color: #c0c4cc;
  }
  
  /* 其他样式同UserManagement */
  </style>