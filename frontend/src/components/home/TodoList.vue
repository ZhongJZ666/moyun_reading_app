<template>
  <el-card class="todo-list">
    <template #header>
      <div class="card-header">
        <span>待办事项</span>
        <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
      </div>
    </template>
    <el-input
      v-if="isAdding"
      v-model="newTodo"
      placeholder="请输入待办事项"
      @keyup.enter="handleSubmit"
      @blur="handleCancel"
    />
    <el-empty v-if="!todos.length" description="暂无待办事项" />
    <el-checkbox-group v-else v-model="completedTodos" class="todo-items">
      <div v-for="todo in todos" :key="todo.id" class="todo-item">
        <el-checkbox :label="todo.id">
          <span :class="{ completed: completedTodos.includes(todo.id) }">
            {{ todo.content }}
          </span>
        </el-checkbox>
        <el-button
          type="danger"
          size="small"
          circle
          @click="handleDelete(todo)"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </el-checkbox-group>
  </el-card>
</template>

<script>
import { Delete } from '@element-plus/icons-vue'

export default {
  name: 'TodoList',
  components: {
    Delete
  },
  props: {
    todos: {
      type: Array,
      default: () => []
    },
    completedTodoIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isAdding: false,
      newTodo: '',
      completedTodos: []
    }
  },
  watch: {
    completedTodoIds: {
      immediate: true,
      handler(val) {
        this.completedTodos = val
      }
    }
  },
  methods: {
    handleAdd() {
      this.isAdding = true
    },
    handleSubmit() {
      if (this.newTodo.trim()) {
        this.$emit('add', this.newTodo.trim())
        this.newTodo = ''
        this.isAdding = false
      }
    },
    handleCancel() {
      this.isAdding = false
      this.newTodo = ''
    },
    handleDelete(todo) {
      this.$confirm('确定要删除这个待办事项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', todo)
      })
    }
  }
}
</script>

<style scoped>
.todo-list {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.completed {
  text-decoration: line-through;
  color: var(--text-color-secondary);
}
</style> 