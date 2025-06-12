<template>
    <div class="user-management">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>用户管理</span>
            <div class="header-actions">
              <el-input
                v-model="searchQuery"
                placeholder="搜索用户名/邮箱"
                clearable
                style="width: 300px"
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              >
                <template #append>
                  <el-button icon="el-icon-search" @click="handleSearch" />
                </template>
              </el-input>
              <el-button 
                type="primary" 
                icon="el-icon-plus"
                @click="showCreateDialog = true"
              >
                新增用户
              </el-button>
            </div>
          </div>
        </template>
  
        <el-table 
          :data="users" 
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色">
            <template #default="{row}">
              <el-tag :type="roleTagType(row.role)">
                {{ formatRole(row.role) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="注册时间" width="180">
            <template #default="{row}">
              {{ formatDate(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="{row}">
              <el-button 
                size="mini" 
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button 
                size="mini" 
                type="danger"
                @click="handleDelete(row.id)"
                v-if="row.id !== currentUserId"
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
  
      <!-- 用户编辑对话框 -->
      <user-edit-dialog 
        v-model="showEditDialog"
        :user="currentUser"
        @success="handleEditSuccess"
      />
  
      <!-- 用户创建对话框 -->
      <user-create-dialog 
        v-model="showCreateDialog"
        @success="handleCreateSuccess"
      />
    </div>
  </template>
  
  <script>
  import { format } from 'date-fns'
  import { mapState, mapActions } from 'vuex'
  import UserEditDialog from '@/components/admin/UserEditDialog.vue'
  import UserCreateDialog from '@/components/admin/UserCreateDialog.vue'
  
  export default {
    name: 'UserManagement',
    components: {
      UserEditDialog,
      UserCreateDialog
    },
    data() {
      return {
        searchQuery: '',
        currentPage: 1,
        pageSize: 10,
        showEditDialog: false,
        showCreateDialog: false,
        currentUser: null
      }
    },
    computed: {
      ...mapState('admin', ['users', 'loading']),
      ...mapState('auth', ['user']),
      total() {
        return this.users.length // 实际项目应从API获取
      },
      currentUserId() {
        return this.user?.id
      }
    },
    methods: {
      ...mapActions('admin', ['fetchUsers', 'deleteUser']),
      
      formatRole(role) {
        const roles = {
          student: '学生',
          mentor: '导师',
          admin: '管理员'
        }
        return roles[role] || role
      },
      
      roleTagType(role) {
        const types = {
          student: '',
          mentor: 'warning',
          admin: 'danger'
        }
        return types[role] || ''
      },
      
      formatDate(date) {
        return format(new Date(date), 'yyyy-MM-dd HH:mm')
      },
      
      handleSearch() {
        this.currentPage = 1
        this.fetchUsers({
          query: this.searchQuery,
          page: this.currentPage,
          pageSize: this.pageSize
        })
      },
      
      handleSizeChange(size) {
        this.pageSize = size
        this.fetchUsers({
          query: this.searchQuery,
          page: this.currentPage,
          pageSize: this.pageSize
        })
      },
      
      handlePageChange(page) {
        this.currentPage = page
        this.fetchUsers({
          query: this.searchQuery,
          page: this.currentPage,
          pageSize: this.pageSize
        })
      },
      
      handleEdit(user) {
        this.currentUser = { ...user }
        this.showEditDialog = true
      },
      
      async handleDelete(userId) {
        try {
          await this.$confirm('确定删除此用户吗？', '警告', {
            type: 'warning'
          })
          await this.deleteUser(userId)
          this.$message.success('用户已删除')
        } catch (error) {
          if (error !== 'cancel') {
            this.$message.error(error.message)
          }
        }
      },
      
      handleEditSuccess() {
        this.showEditDialog = false
        this.fetchUsers()
      },
      
      handleCreateSuccess() {
        this.showCreateDialog = false
        this.fetchUsers()
      }
    },
    created() {
      this.fetchUsers()
    }
  }
  </script>
  
  <style scoped>
  .user-management {
    padding: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-actions {
    display: flex;
    gap: 10px;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  </style>