<template>
  <el-card class="recent-users">
    <template #header>
      <div class="card-header">
        <span>最近注册用户</span>
        <el-button type="text">查看全部</el-button>
      </div>
    </template>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="avatar" label="" width="50">
        <template #default="{ row }">
          <el-avatar :size="32" :src="row.avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="registerTime" label="注册时间" width="180" />
    </el-table>
  </el-card>
</template>

<script>
import { User } from '@element-plus/icons-vue'

export default {
  name: 'RecentUsers',
  components: {
    User
  },
  data() {
    return {
      users: [
        {
          username: '用户1',
          avatar: '',
          registerTime: '2025-05-18 12:00:00'
        },
        {
          username: '用户2',
          avatar: '',
          registerTime: '2025-05-18 11:30:00'
        }
      ]
    }
  }
}
</script>

<style scoped>
.recent-users {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 