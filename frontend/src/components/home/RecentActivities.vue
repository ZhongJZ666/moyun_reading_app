<template>
  <div class="recent-activities">
    <div class="section-header">
      <h2>最新动态</h2>
      <el-button type="text" @click="handleViewAll">查看全部</el-button>
    </div>
    <div class="activities-list">
      <el-card
        v-for="activity in activities"
        :key="activity.id"
        class="activity-card"
        :body-style="{ padding: '15px' }"
      >
        <div class="activity-header">
          <div class="user-info">
            <el-avatar :size="40" :src="activity.user.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="user-details">
              <span class="username">{{ activity.user.username }}</span>
              <span class="activity-time">{{ activity.createTime }}</span>
            </div>
          </div>
          <el-dropdown v-if="isAuthor(activity.user.id)">
            <el-button type="text">
              <el-icon><More /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleEdit(activity)">编辑</el-dropdown-item>
                <el-dropdown-item @click="handleDelete(activity)" class="danger">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="activity-content">
          <p class="activity-text">{{ activity.content }}</p>
          <div v-if="activity.images && activity.images.length" class="activity-images">
            <el-image
              v-for="(image, index) in activity.images"
              :key="index"
              :src="image"
              :preview-src-list="activity.images"
              fit="cover"
              class="activity-image"
            />
          </div>
        </div>
        <div class="activity-footer">
          <el-button type="text" @click="handleLike(activity)">
            <el-icon><Thumb /></el-icon>
            <span>{{ activity.likeCount }}</span>
          </el-button>
          <el-button type="text" @click="handleComment(activity)">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ activity.commentCount }}</span>
          </el-button>
          <el-button type="text" @click="handleShare(activity)">
            <el-icon><Share /></el-icon>
            <span>分享</span>
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { User, More, Thumb, ChatDotRound, Share } from '@element-plus/icons-vue'

export default {
  name: 'RecentActivities',
  components: {
    User,
    More,
    Thumb,
    ChatDotRound,
    Share
  },
  props: {
    activities: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    isAuthor(userId) {
      // 这里需要根据实际用户ID判断
      return userId === 'current-user-id'
    },
    handleViewAll() {
      this.$emit('view-all')
    },
    handleEdit(activity) {
      this.$emit('edit', activity)
    },
    handleDelete(activity) {
      this.$confirm('确定要删除这条动态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', activity)
      })
    },
    handleLike(activity) {
      this.$emit('like', activity)
    },
    handleComment(activity) {
      this.$emit('comment', activity)
    },
    handleShare(activity) {
      this.$emit('share', activity)
    }
  }
}
</script>

<style scoped>
.recent-activities {
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

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-card {
  transition: transform 0.3s;
}

.activity-card:hover {
  transform: translateY(-2px);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  color: var(--text-color);
}

.activity-time {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.activity-content {
  margin-bottom: 15px;
}

.activity-text {
  margin: 0 0 10px;
  color: var(--text-color);
  line-height: 1.6;
}

.activity-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.activity-image {
  width: 100%;
  height: 120px;
  border-radius: 4px;
  cursor: pointer;
}

.activity-footer {
  display: flex;
  gap: 20px;
}

.danger {
  color: var(--danger-color);
}
</style> 