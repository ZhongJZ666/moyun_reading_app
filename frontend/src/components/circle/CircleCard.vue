<template>
  <el-card class="circle-card" :body-style="{ padding: '0' }" @click="handleView">
    <div class="circle-cover">
      <el-image :src="circle.cover" fit="cover" :alt="circle.name">
        <template #error>
          <div class="image-placeholder">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>
    <div class="circle-content">
      <div class="circle-header">
        <h3 class="circle-name">{{ circle.name }}</h3>
        <el-tag size="small" :type="circle.isJoined ? 'success' : 'info'">
          {{ circle.isJoined ? '已加入' : '未加入' }}
        </el-tag>
      </div>
      <p class="circle-description">{{ circle.description }}</p>
      <div class="circle-stats">
        <div class="stat-item">
          <el-icon><User /></el-icon>
          <span>{{ circle.memberCount }}人</span>
        </div>
        <div class="stat-item">
          <el-icon><ChatDotRound /></el-icon>
          <span>{{ circle.postCount }}帖子</span>
        </div>
      </div>
      <div class="circle-footer">
        <el-button
          :type="circle.isJoined ? 'default' : 'primary'"
          size="small"
          @click="handleJoin"
        >
          {{ circle.isJoined ? '退出圈子' : '加入圈子' }}
        </el-button>
        <el-button type="text" @click="handleView">查看详情</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Picture, User, ChatDotRound } from '@element-plus/icons-vue'

export default {
  name: 'CircleCard',
  components: {
    Picture,
    User,
    ChatDotRound
  },
  props: {
    circle: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleJoin() {
      this.$emit('join', this.circle)
    },
    handleView() {
      this.$router.push(`/circle/${this.circle.id}`)
    }
  }
}
</script>

<style scoped>
.circle-card {
  width: 100%;
  max-width: 300px;
  margin: 10px;
  transition: transform 0.3s;
}

.circle-card:hover {
  transform: translateY(-5px);
}

.circle-cover {
  height: 160px;
  overflow: hidden;
}

.circle-cover .el-image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color-light);
  color: var(--text-color-secondary);
}

.circle-content {
  padding: 15px;
}

.circle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.circle-name {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.circle-description {
  margin: 0 0 15px;
  font-size: 14px;
  color: var(--text-color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.circle-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-color-secondary);
  font-size: 14px;
}

.circle-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 