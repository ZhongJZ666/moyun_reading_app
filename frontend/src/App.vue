<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <el-backtop :right="50" :bottom="50" />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: { Navbar },
  computed: {
    ...mapState('auth', ['user']),
    showNavbar() {
      return this.$route.name !== 'Login' && this.$route.name !== 'Register'
    }
  },
  created() {
    // 只在有token时才检查认证状态
    const token = localStorage.getItem('token')
    if (token) {
      this.$store.dispatch('auth/checkAuth').catch(() => {
        // 如果检查失败，清除认证数据
        this.$store.dispatch('auth/logout')
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

/* 全局过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 全局覆盖Element样式 */
.el-card {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>