<template>
    <div class="member-management">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>成员管理</span>
            <el-button 
              type="primary" 
              size="small"
              @click="showInviteDialog = true"
            >
              批量导入
            </el-button>
          </div>
        </template>
        
        <el-table :data="members" v-loading="loading">
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色">
            <template #default="{row}">
              <el-tag :type="roleTagType(row.role)">
                {{ roleText(row.role) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="{row}">
              <el-button 
                size="small" 
                type="danger"
                @click="handleRemove(row.id)"
                v-if="row.id !== user.id"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <el-dialog 
        title="批量导入成员" 
        v-model="showInviteDialog"
        width="600px"
      >
        <bulk-invite-form 
          :circle-id="circleId"
          @success="handleBulkInviteSuccess"
        />
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex'
  
  export default {
    name: 'MemberManagementView',
    props: {
      circleId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        showInviteDialog: false,
        loading: false
      }
    },
    computed: {
      ...mapState('circles', ['members']),
      ...mapState('auth', ['user'])
    },
    methods: {
      roleText(role) {
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
      async handleRemove(memberId) {
        try {
          await this.$confirm('确定移除此成员吗？', '提示', {
            type: 'warning'
          })
          await this.$store.dispatch('circles/removeMember', {
            circleId: this.circleId,
            memberId
          })
          this.$message.success('成员已移除')
        } catch (error) {
          if (error !== 'cancel') {
            this.$message.error(error.message)
          }
        }
      },
      handleBulkInviteSuccess() {
        this.showInviteDialog = false
        this.$store.dispatch('circles/fetchCircleMembers', this.circleId)
      }
    }
  }
  </script>
  
  <style scoped>
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>