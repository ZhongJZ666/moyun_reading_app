<template>
  <div class="circle-member">
    <div class="member-header">
      <h3>成员管理</h3>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索成员"
          prefix-icon="Search"
          clearable
          @input="handleSearch"
        />
        <el-button
          type="primary"
          @click="showInviteDialog = true"
        >
          邀请成员
        </el-button>
      </div>
    </div>

    <!-- 成员列表 -->
    <el-table
      v-loading="loading"
      :data="filteredMembers"
      style="width: 100%"
    >
      <el-table-column label="成员" min-width="200">
        <template #default="{ row }">
          <div class="member-info">
            <el-avatar :size="40" :src="row.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="info">
              <span class="username">{{ row.username }}</span>
              <span class="join-time">加入时间：{{ row.joinTime }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="角色" width="150">
        <template #default="{ row }">
          <el-tag
            :type="getRoleType(row.role)"
            effect="plain"
          >
            {{ getRoleName(row.role) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag
            :type="row.status === 'active' ? 'success' : 'warning'"
            effect="plain"
          >
            {{ row.status === 'active' ? '正常' : '禁言' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="canManageRole(row)"
            type="primary"
            link
            @click="handleChangeRole(row)"
          >
            修改角色
          </el-button>
          <el-button
            v-if="canManageStatus(row)"
            :type="row.status === 'active' ? 'warning' : 'success'"
            link
            @click="handleChangeStatus(row)"
          >
            {{ row.status === 'active' ? '禁言' : '解除禁言' }}
          </el-button>
          <el-button
            v-if="canRemove(row)"
            type="danger"
            link
            @click="handleRemove(row)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 修改角色对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      title="修改角色"
      width="400px"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        label-width="80px"
      >
        <el-form-item label="角色">
          <el-select v-model="roleForm.role">
            <el-option
              v-for="role in availableRoles"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="submitRoleChange"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 邀请成员对话框 -->
    <invite-member-form
      v-if="showInviteDialog"
      v-model="showInviteDialog"
      :circle-id="circleId"
      @success="handleInviteSuccess"
    />
  </div>
</template>

<script>
import { User, Search } from '@element-plus/icons-vue'
import InviteMemberForm from './InviteMemberForm.vue'

export default {
  name: 'CircleMember',
  components: {
    User,
    Search,
    InviteMemberForm
  },
  props: {
    circleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      loading: false,
      submitting: false,
      members: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      roleDialogVisible: false,
      showInviteDialog: false,
      currentMember: null,
      roleForm: {
        role: ''
      },
      availableRoles: [
        { label: '普通成员', value: 'member' },
        { label: '管理员', value: 'admin' },
        { label: '版主', value: 'moderator' }
      ]
    }
  },
  computed: {
    filteredMembers() {
      if (!this.searchQuery) return this.members
      const query = this.searchQuery.toLowerCase()
      return this.members.filter(member =>
        member.username.toLowerCase().includes(query)
      )
    }
  },
  created() {
    this.fetchMembers()
  },
  methods: {
    async fetchMembers() {
      this.loading = true
      try {
        const response = await this.$http.get(`/api/circles/${this.circleId}/members`, {
          params: {
            page: this.currentPage,
            size: this.pageSize
          }
        })
        this.members = response.data.items
        this.total = response.data.total
      } catch (error) {
        this.$message.error('获取成员列表失败')
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchMembers()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchMembers()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchMembers()
    },
    getRoleType(role) {
      const types = {
        owner: 'danger',
        admin: 'warning',
        moderator: 'success',
        member: 'info'
      }
      return types[role] || 'info'
    },
    getRoleName(role) {
      const names = {
        owner: '圈主',
        admin: '管理员',
        moderator: '版主',
        member: '成员'
      }
      return names[role] || '成员'
    },
    canManageRole(member) {
      // 实现角色管理权限判断逻辑
      return true
    },
    canManageStatus(member) {
      // 实现状态管理权限判断逻辑
      return true
    },
    canRemove(member) {
      // 实现移除成员权限判断逻辑
      return true
    },
    handleChangeRole(member) {
      this.currentMember = member
      this.roleForm.role = member.role
      this.roleDialogVisible = true
    },
    async submitRoleChange() {
      if (!this.currentMember) return

      this.submitting = true
      try {
        await this.$http.put(
          `/api/circles/${this.circleId}/members/${this.currentMember.id}/role`,
          { role: this.roleForm.role }
        )
        this.currentMember.role = this.roleForm.role
        this.roleDialogVisible = false
        this.$message.success('角色修改成功')
      } catch (error) {
        this.$message.error('角色修改失败')
      } finally {
        this.submitting = false
      }
    },
    async handleChangeStatus(member) {
      try {
        const action = member.status === 'active' ? 'mute' : 'unmute'
        await this.$http.put(
          `/api/circles/${this.circleId}/members/${member.id}/${action}`
        )
        member.status = member.status === 'active' ? 'muted' : 'active'
        this.$message.success(
          member.status === 'active' ? '已解除禁言' : '已禁言'
        )
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    async handleRemove(member) {
      try {
        await this.$confirm(
          `确定要将 ${member.username} 移出圈子吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        await this.$http.delete(
          `/api/circles/${this.circleId}/members/${member.id}`
        )
        const index = this.members.findIndex(m => m.id === member.id)
        if (index !== -1) {
          this.members.splice(index, 1)
        }
        this.$message.success('成员已移除')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('移除失败')
        }
      }
    },
    handleInviteSuccess() {
      this.fetchMembers()
    }
  }
}
</script>

<style scoped>
.circle-member {
  .member-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      color: var(--text-color);
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .member-info {
    display: flex;
    align-items: center;
    gap: 10px;

    .info {
      display: flex;
      flex-direction: column;

      .username {
        font-weight: bold;
        color: var(--text-color);
      }

      .join-time {
        font-size: 12px;
        color: var(--text-color-secondary);
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 