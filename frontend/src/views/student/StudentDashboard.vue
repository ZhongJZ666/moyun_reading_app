<template>
  <div class="student-dashboard">
    <h1>学生工作台</h1>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>我的导师</span>
            </div>
          </template>
          <div class="mentor-info">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="用户名">
                {{ mentor?.username || '暂无导师' }}
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">
                {{ mentor?.email || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
            </div>
          </template>
          <div class="activity-list">
            <el-timeline>
              <el-timeline-item
                v-for="activity in activities"
                :key="activity.id"
                :timestamp="activity.time"
                :type="activity.type"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
            </div>
          </template>
          <div class="todo-list">
            <el-empty v-if="!todos.length" description="暂无待办" />
            <el-checkbox-group v-else v-model="checkedTodos">
              <el-checkbox
                v-for="todo in todos"
                :key="todo.id"
                :label="todo.id"
              >
                {{ todo.content }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'StudentDashboard',
  data() {
    return {
      mentor: null,
      activities: [],
      todos: [],
      checkedTodos: []
    }
  },
  async created() {
    // TODO: 从API获取数据
    this.mentor = {
      username: 'mentor1',
      email: 'mentor1@example.com'
    }
    this.activities = [
      { id: 1, content: '提交了读书报告', time: '2024-05-20 10:00', type: 'primary' },
      { id: 2, content: '参加了读书会活动', time: '2024-05-19 15:30', type: 'success' }
    ]
    this.todos = [
      { id: 1, content: '完成本周读书报告' },
      { id: 2, content: '准备下周读书会发言' }
    ]
  }
}
</script>

<style scoped>
.student-dashboard {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mentor-info,
.activity-list,
.todo-list {
  min-height: 200px;
}

.el-timeline {
  padding: 0;
  margin: 0;
}
</style> 