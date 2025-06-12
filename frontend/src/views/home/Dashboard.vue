<template>
    <div class="dashboard-container">
      <h2>数据概览</h2>
      <el-divider />
      
      <!-- 数据统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6" v-for="stat in stats" :key="stat.title">
          <stat-card 
            :title="stat.title" 
            :value="stat.value" 
            :icon="stat.icon"
            :color="stat.color"
          />
        </el-col>
      </el-row>
      
      <!-- 最近阅读 -->
      <el-card class="recent-books">
        <template #header>
          <div class="card-header">
            <span>最近阅读</span>
            <el-button 
              type="text"
              @click="$router.push('/books')"
            >
              查看更多
            </el-button>
          </div>
        </template>
        <book-carousel :books="recentBooks" />
      </el-card>
      
      <!-- 待办事项 -->
      <el-row :gutter="20" class="todo-row">
        <el-col :span="12">
          <todo-list />
        </el-col>
        <el-col :span="12">
          <calendar-widget />
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex'
  import StatCard from '@/components/home/StatCard.vue'
  import BookCarousel from '@/components/book/BookCarousel.vue'
  import TodoList from '@/components/home/TodoList.vue'
  import CalendarWidget from '@/components/home/CalendarWidget.vue'
  
  export default {
    name: 'DashboardView',
    components: {
      StatCard,
      BookCarousel,
      TodoList,
      CalendarWidget
    },
    data() {
      return {
        stats: [
          {
            title: '本周阅读',
            value: '5本',
            icon: 'el-icon-notebook-2',
            color: '#409EFF'
          },
          {
            title: '读书笔记',
            value: '12篇',
            icon: 'el-icon-edit',
            color: '#67C23A'
          },
          {
            title: '圈子动态',
            value: '23条',
            icon: 'el-icon-chat-line-round',
            color: '#E6A23C'
          },
          {
            title: '待办事项',
            value: '3项',
            icon: 'el-icon-alarm-clock',
            color: '#F56C6C'
          }
        ]
      }
    },
    computed: {
      ...mapState('books', ['recentBooks'])
    },
    async created() {
      await this.$store.dispatch('books/fetchRecentBooks')
    }
  }
  </script>
  
  <style scoped>
  .dashboard-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .stats-row {
    margin-bottom: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .recent-books {
    margin: 20px 0;
  }
  
  .todo-row {
    margin-top: 20px;
  }
  </style>