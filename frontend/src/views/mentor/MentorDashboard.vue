<template>
  <div class="mentor-dashboard">
    <h1>导师工作台</h1>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card v-loading="loading.students">
          <template #header>
            <div class="card-header">
              <span>我的学生（{{ students.length }}）</span>
              <el-button type="text" @click="refreshStudents">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </div>
          </template>
          <div class="student-list">
            <el-empty v-if="!students.length" description="暂无学生" />
            <el-table v-else :data="students" style="width: 100%">
              <el-table-column prop="username" label="用户名" />
              <el-table-column prop="email" label="邮箱" />
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button type="text" @click="viewStudentProfile(row)">
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading.activities">
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <el-button type="text" @click="refreshActivities">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </div>
          </template>
          <div class="activity-list">
            <el-empty v-if="!activities.length" description="暂无活动" />
            <el-timeline v-else>
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
        <el-card v-loading="loading.todos">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
              <el-button type="text" @click="refreshTodos">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </div>
          </template>
          <div class="todo-list">
            <el-empty v-if="!todos.length" description="暂无待办" />
            <el-checkbox-group v-else v-model="checkedTodos" @change="handleTodoChange">
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
import { getMentorDashboard, updateTodoStatus } from '@/api/dashboard'
import { Refresh } from '@element-plus/icons-vue'

export default {
  name: 'MentorDashboard',
  components: {
    Refresh
  },
  data() {
    return {
      students: [],
      activities: [],
      todos: [],
      checkedTodos: [],
      loading: {
        students: false,
        activities: false,
        todos: false
      }
    }
  },
  async created() {
    await this.fetchDashboardData()
  },
  methods: {
    async fetchDashboardData() {
      try {
        const dashboard = await getMentorDashboard()
        this.students = dashboard.students
        this.activities = dashboard.activities
        this.todos = dashboard.todos
        this.checkedTodos = dashboard.todos
          .filter(todo => todo.completed)
          .map(todo => todo.id)
      } catch (error) {
        this.$message.error('获取数据失败：' + error.message)
      }
    },
    async refreshStudents() {
      this.loading.students = true
      try {
        const dashboard = await getMentorDashboard()
        this.students = dashboard.students
      } catch (error) {
        this.$message.error('刷新学生列表失败：' + error.message)
      } finally {
        this.loading.students = false
      }
    },
    async refreshActivities() {
      this.loading.activities = true
      try {
        const dashboard = await getMentorDashboard()
        this.activities = dashboard.activities
      } catch (error) {
        this.$message.error('刷新活动列表失败：' + error.message)
      } finally {
        this.loading.activities = false
      }
    },
    async refreshTodos() {
      this.loading.todos = true
      try {
        const dashboard = await getMentorDashboard()
        this.todos = dashboard.todos
        this.checkedTodos = dashboard.todos
          .filter(todo => todo.completed)
          .map(todo => todo.id)
      } catch (error) {
        this.$message.error('刷新待办事项失败：' + error.message)
      } finally {
        this.loading.todos = false
      }
    },
    async handleTodoChange(value) {
      try {
        const todoId = value[value.length - 1]
        const completed = this.checkedTodos.includes(todoId)
        await updateTodoStatus(todoId, completed)
        this.$message.success('更新待办状态成功')
      } catch (error) {
        this.$message.error('更新待办状态失败：' + error.message)
        // 恢复原状态
        await this.refreshTodos()
      }
    },
    viewStudentProfile(student) {
      this.$router.push(`/profile/${student.id}`)
    }
  }
}
</script>

<style scoped>
.mentor-dashboard {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.student-list,
.activity-list,
.todo-list {
  min-height: 200px;
}

.el-timeline {
  padding: 0;
  margin: 0;
}

.el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style> 