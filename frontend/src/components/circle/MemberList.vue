<template>
  <div class="member-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>圈子成员</span>
          <el-button type="primary" size="small" @click="handleInvite">邀请成员</el-button>
        </div>
      </template>
      <el-table :data="members" style="width: 100%">
        <el-table-column prop="avatar" label="" width="50">
          <template #default="{ row }">
            <el-avatar :size="32" :src="row.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'info'" size="small">
              {{ row.role === 'admin' ? '管理员' : '成员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinTime" label="加入时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button
              v-if="canManage(row)"
              type="danger"
              size="small"
              @click="handleRemove(row)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { User } from '@element-plus/icons-vue'

export default {
  name: 'MemberList',
  components: {
    User
  },
  props: {
    members: {
      type: Array,
      default: () => []
    },
    currentUserRole: {
      type: String,
      default: 'member'
    }
  },
  methods: {
    canManage(member) {
      return this.currentUserRole === 'admin' && member.role !== 'admin'
    },
    handleInvite() {
      this.$emit('invite')
    },
    handleRemove(member) {
      this.$confirm('确定要移除该成员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('remove', member)
      })
    }
  }
}
</script>

<style scoped>
.member-list {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 