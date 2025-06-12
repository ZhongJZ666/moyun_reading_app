<template>
  <div class="popular-circles">
    <div class="section-header">
      <h2>热门圈子</h2>
      <el-button type="text" @click="handleViewAll">查看全部</el-button>
    </div>
    <div class="circles-grid">
      <el-card
        v-for="circle in circles"
        :key="circle.id"
        class="circle-card"
        :body-style="{ padding: '0' }"
        @click="handleCircleClick(circle)"
      >
        <div class="circle-cover">
          <el-image :src="circle.cover" fit="cover">
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="circle-tags" v-if="circle.tags && circle.tags.length">
            <el-tag
              v-for="tag in circle.tags"
              :key="tag"
              size="small"
              class="circle-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        <div class="circle-info">
          <h3 class="circle-title">{{ circle.name }}</h3>
          <p class="circle-description">{{ circle.description }}</p>
          <div class="circle-stats">
            <div class="stat-item">
              <el-icon><User /></el-icon>
              <span>{{ circle.memberCount }}人</span>
            </div>
            <div class="stat-item">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ circle.postCount }}篇</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Picture, User, ChatDotRound } from '@element-plus/icons-vue'

export default {
  name: 'PopularCircles',
  components: {
    Picture,
    User,
    ChatDotRound
  },
  props: {
    circles: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleViewAll() {
      this.$emit('view-all')
    },
    handleCircleClick(circle) {
      this.$emit('circle-click', circle)
    }
  }
}
</script>

<style scoped>
.popular-circles {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--text-color);
}

.circles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.circle-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.circle-card:hover {
  transform: translateY(-5px);
}

.circle-cover {
  height: 160px;
  overflow: hidden;
  position: relative;
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

.circle-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.circle-tag {
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
}

.circle-info {
  padding: 15px;
}

.circle-title {
  margin: 0 0 5px;
  font-size: 18px;
  color: var(--text-color);
}

.circle-description {
  margin: 0 0 10px;
  font-size: 14px;
  color: var(--text-color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.circle-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-color-secondary);
  font-size: 14px;
}
</style> 