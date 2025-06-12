<template>
    <nav class="navbar">
      <router-link to="/" class="logo">
        <img src="@/assets/logo.png" alt="墨韵读书会" title="墨韵读书会">
      </router-link>
  
      <div class="nav-links">
        <router-link v-if="isAuthenticated" to="/books">书库</router-link>
        <router-link v-if="isAuthenticated" to="/my-circle">我的圈子</router-link>
      </div>
  
      <div class="user-menu">
        <template v-if="isAuthenticated">
          <!-- 通知图标 -->
          <el-badge
            :value="unreadNotifications"
            :hidden="!unreadNotifications"
            class="notification-badge"
          >
            <el-button
              type="text"
              @click="$router.push('/notifications')"
              title="查看通知"
            >
              <el-icon><Bell /></el-icon>
            </el-button>
          </el-badge>

          <!-- 消息图标 -->
          <el-badge
            :value="unreadMessages"
            :hidden="!unreadMessages"
            class="message-badge"
          >
            <el-button
              type="text"
              @click="$router.push('/messages')"
              title="查看消息"
            >
              <el-icon><ChatDotRound /></el-icon>
            </el-button>
          </el-badge>

          <el-dropdown>
            <span class="user-avatar">
              <el-avatar :size="36" :src="user.avatar || defaultAvatar" />
              {{ user.username }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">登录</router-link>
        </template>
      </div>
    </nav>
  </template>
  
  <script>
  import { mapState, mapGetters } from 'vuex';
  import defaultAvatar from '@/assets/default-avatar.png';
  import { Bell, ChatDotRound } from '@element-plus/icons-vue';
  
  export default {
    name: 'Navbar',
    components: {
      Bell,
      ChatDotRound
    },
    data() {
      return { 
        defaultAvatar,
        unreadNotifications: 0,
        unreadMessages: 0
      };
    },
    computed: {
      ...mapState('auth', ['user']),
      ...mapGetters('auth', ['isAuthenticated'])
    },
    created() {
      if (this.isAuthenticated) {
        this.fetchUnreadCounts();
      }
    },
    methods: {
      goToProfile() {
        this.$router.push('/profile');
      },
      async logout() {
        await this.$store.dispatch('auth/logout');
        this.$router.push('/login');
      },
      async fetchUnreadCounts() {
        try {
          const [notifications, messages] = await Promise.all([
            this.$http.get('/api/notifications/unread/count'),
            this.$http.get('/api/messages/unread/count')
          ]);
          this.unreadNotifications = notifications.data.count;
          this.unreadMessages = messages.data.count;
        } catch (error) {
          console.error('获取未读数量失败:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .logo img {
    height: 40px;
  }
  
  .nav-links {
    flex: 1;
    margin-left: 30px;
  }
  
  .nav-links a {
    margin-right: 20px;
    color: #333;
    text-decoration: none;
  }
  
  .user-avatar {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .login-btn {
    padding: 5px 15px;
    border: 1px solid #409EFF;
    border-radius: 4px;
    color: #409EFF;
  }
  
  .notification-badge,
  .message-badge {
    margin-right: 15px;
  }
  
  .el-button {
    padding: 8px;
  }
  
  .el-icon {
    font-size: 20px;
  }
  </style>