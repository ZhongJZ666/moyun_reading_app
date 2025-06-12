<template>
    <div class="post-management">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>内容审核</span>
            <el-radio-group v-model="filterStatus" @change="handleFilterChange">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="pending">待审核</el-radio-button>
              <el-radio-button label="reported">被举报</el-radio-button>
            </el-radio-group>
          </div>
        </template>
  
        <el-table 
          :data="posts" 
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column prop="title" label="标题" />
          <el-table-column label="作者" width="120">
            <template #default="{row}">
              {{ row.author_name }}
            </template>
          </el-table-column>
          <el-table-column label="内容预览" width="200">
            <template #default="{row}">
              <el-popover
                placement="top-start"
                width="300"
                trigger="hover"
              >
                <div class="content-preview">{{ row.content }}</div>
                <template #reference>
                  <el-button type="text">{{ truncate(row.content, 20) }}</el-button>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="举报次数" width="100">
            <template #default="{row}">
              <el-tag v-if="row.report_count > 0" type="danger">
                {{ row.report_count }}
              </el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{row}">
              <el-tag :type="getStatusTagType(row)">
                {{ formatStatus(row) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
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
                type="warning"
                @click="handleReject(row.id)"
                v-if="row.status !== 'rejected'"
              >
                拒绝
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
  import { mapState, mapActions } from 'vuex'
  
  export default {
    name: 'PostManagement',
    data() {
      return {
        filterStatus: 'all',
        currentPage: 1,
        pageSize: 10
      }
    },
    computed: {
      ...mapState('admin', ['posts', 'loading']),
      total() {
        return this.posts.length // 实际项目应从API获取
      }
    },
    methods: {
      ...mapActions('admin', ['fetchPosts', 'approvePost', 'rejectPost', 'deletePost']),
      
      truncate(text, length) {
        return text.length > length 
          ? text.substring(0, length) + '...' 
          : text
      },
      
      formatStatus(post) {
        if (post.report_count > 0) return '被举报'
        const statusMap = {
          pending: '待审核',
          approved: '已通过',
          rejected: '已拒绝'
        }
        return statusMap[post.status] || post.status
      },
      
      getStatusTagType(post) {
        if (post.report_count > 0) return 'danger'
        return post.status === 'approved' ? 'success' : 
               post.status === 'rejected' ? 'warning' : ''
      },
      
      handleFilterChange() {
        this.currentPage = 1
        this.fetchPosts({
          status: this.filterStatus === 'all' ? null : this.filterStatus,
          page: this.currentPage,
          pageSize: this.pageSize
        })
      },
      
      handleSizeChange(size) {
        this.pageSize = size
        this.fetchPosts({
          status: this.filterStatus === 'all' ? null : this.filterStatus,
          page: this.currentPage,
          pageSize: this.pageSize
        })
      },
      
      handlePageChange(page) {
        this.currentPage = page
        this.fetchPosts({
          status: this.filterStatus === 'all' ? null : this.filterStatus,
          page: this.currentPage,
          pageSize: this.pageSize
        })
      },
      
      async handleApprove(postId) {
        try {
          await this.approvePost(postId)
          this.$message.success('内容已通过审核')
        } catch (error) {
          this.$message.error(error.message)
        }
      },
      
      async handleReject(postId) {
        try {
          await this.rejectPost(postId)
          this.$message.success('内容已拒绝')
        } catch (error) {
          this.$message.error(error.message)
        }
      },
      
      async handleDelete(postId) {
        try {
          await this.$confirm('确定删除此内容吗？', '警告', {
            type: 'warning'
          })
          await this.deletePost(postId)
          this.$message.success('内容已删除')
        } catch (error) {
          if (error !== 'cancel') {
            this.$message.error(error.message)
          }
        }
      }
    },
    created() {
      this.fetchPosts()
    }
  }
  </script>
  
  <style scoped>
  .content-preview {
    max-height: 200px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  /* 其他样式同UserManagement */
  </style>