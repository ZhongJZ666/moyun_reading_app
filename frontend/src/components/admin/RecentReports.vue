<template>
  <el-card class="recent-reports">
    <template #header>
      <div class="card-header">
        <span>最近举报</span>
        <el-button type="text">查看全部</el-button>
      </div>
    </template>
    <el-table :data="reports" style="width: 100%">
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="reporter" label="举报人" width="120" />
      <el-table-column prop="reportTime" label="举报时间" width="180" />
      <el-table-column label="操作" width="120">
        <template #default>
          <el-button type="primary" size="small">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'RecentReports',
  data() {
    return {
      reports: [
        {
          type: '帖子',
          content: '违规内容示例1',
          reporter: '用户1',
          reportTime: '2025-05-18 12:00:00'
        },
        {
          type: '评论',
          content: '违规内容示例2',
          reporter: '用户2',
          reportTime: '2025-05-18 11:30:00'
        }
      ]
    }
  }
}
</script>

<style scoped>
.recent-reports {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 