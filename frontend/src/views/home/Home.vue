<template>
    <div class="home-container">
      <el-row :gutter="20">
        <!-- 左侧内容区 -->
        <el-col :span="18">
          <el-card class="welcome-card">
            <h2>欢迎回来, {{ user.username }}!</h2>
            <p v-if="user.role === 'student'">您的导师: {{ user.mentor?.username || '暂未分配' }}</p>
            <p v-else-if="user.role === 'mentor'">您有 {{ studentsCount }} 名学生</p>
            
            <el-divider />
            
            <div class="quick-actions">
              <el-button 
                type="primary" 
                icon="el-icon-notebook-2"
                @click="$router.push('/books')"
              >
                浏览书库
              </el-button>
              <el-button 
                type="success" 
                icon="el-icon-chat-line-round"
                @click="$router.push('/my-circle')"
                v-if="hasCircle"
              >
                进入圈子
              </el-button>
              <el-button 
                type="warning" 
                icon="el-icon-edit"
                @click="$router.push('/posts/create')"
              >
                发表心得
              </el-button>
            </div>
          </el-card>
  
          <!-- 最近活动 -->
          <activity-feed :activities="recentActivities" />
        </el-col>
        
        <!-- 右侧侧边栏 -->
        <el-col :span="6">
          <recommended-books />
          <upcoming-events />
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters } from 'vuex'
  import ActivityFeed from '@/components/home/ActivityFeed.vue'
  import RecommendedBooks from '@/components/home/RecommendedBooks.vue'
  import UpcomingEvents from '@/components/home/UpcomingEvents.vue'
  
  export default {
    name: 'HomeView',
    components: {
      ActivityFeed,
      RecommendedBooks,
      UpcomingEvents
    },
    computed: {
      ...mapState('auth', ['user']),
      ...mapState('circles', ['circle']),
      ...mapGetters('circles', ['studentsCount']),
      hasCircle() {
        return !!this.circle
      },
      recentActivities() {
        // 实际项目中应从API获取
        return [
          {
            id: 1,
            type: 'post',
            title: '《JavaScript高级程序设计》读后感',
            author: '张三',
            time: '2小时前'
          },
          {
            id: 2,
            type: 'comment',
            content: '评论了您的帖子',
            author: '李四',
            time: '5小时前'
          }
        ]
      }
    },
    async created() {
      if (this.user?.role === 'mentor') {
        await this.$store.dispatch('circles/fetchStudentsByMentorId')
      }
    }
  }
  </script>
  
  <style scoped>
  .home-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .welcome-card h2 {
    margin-top: 0;
    color: #333;
  }
  
  .welcome-card p {
    color: #666;
    margin: 10px 0;
  }
  
  .quick-actions {
    margin-top: 20px;
  }
  
  .quick-actions .el-button {
    margin-right: 10px;
  }
  </style>