<template>
  <div class="notification-list">
    <div class="notification-header">
      <h2>通知中心</h2>
      <div class="header-actions">
        <el-button
          type="primary"
          link
          @click="markAllRead"
        >
          全部标为已读
        </el-button>
        <el-button
          type="danger"
          link
          @click="clearAll"
        >
          清空通知
        </el-button>
      </div>
    </div>

    <!-- 通知类型筛选 -->
    <div class="filter-bar">
      <el-radio-group v-model="activeType" @change="handleTypeChange">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="system">系统通知</el-radio-button>
        <el-radio-button label="comment">评论通知</el-radio-button>
        <el-radio-button label="like">点赞通知</el-radio-button>
        <el-radio-button label="follow">关注通知</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 通知列表 -->
    <div class="notification-items">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :class="{ unread: !notification.read }"
        @click="handleNotificationClick(notification)"
      >
        <div class="notification-icon">
          <el-avatar
            :size="40"
            :src="notification.sender?.avatar"
          >
            <el-icon>
              <component :is="getNotificationIcon(notification.type)" />
            </el-icon>
          </el-avatar>
        </div>

        <div class="notification-content">
          <div class="notification-header">
            <span class="sender">{{ notification.sender?.username || '系统' }}</span>
            <span class="time">{{ formatTime(notification.createTime) }}</span>
          </div>
          <div class="notification-body">
            {{ notification.content }}
          </div>
          <div
            v-if="notification.target"
            class="notification-target"
            @click.stop="handleTargetClick(notification)"
          >
            {{ getTargetText(notification) }}
          </div>
        </div>

        <div class="notification-actions">
          <el-button
            v-if="!notification.read"
            type="primary"
            link
            @click.stop="markAsRead(notification)"
          >
            标为已读
          </el-button>
          <el-button
            type="danger"
            link
            @click.stop="deleteNotification(notification)"
          >
            删除
          </el-button>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="notifications.length === 0"
        description="暂无通知"
      />
    </div>

    <!-- 加载更多 -->
    <div
      v-if="hasMore"
      class="load-more"
    >
      <el-button
        :loading="loading"
        @click="loadMore"
      >
        加载更多
      </el-button>
    </div>
  </div>
</template>

<script>
import { Bell, ChatDotRound, Star, User } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { http } from '@/api/http'

export default {
  name: 'NotificationList',
  components: {
    Bell,
    ChatDotRound,
    Star,
    User
  },
  data() {
    return {
      notifications: [],
      activeType: 'all',
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 20
    }
  },
  created() {
    this.fetchNotifications()
  },
  methods: {
    async fetchNotifications() {
      this.loading = true
      try {
        const response = await http.get('/notifications', {
          params: {
            page: this.page,
            size: this.pageSize,
            type: this.activeType === 'all' ? undefined : this.activeType
          }
        })
        if (this.page === 1) {
          this.notifications = response.data.items
        } else {
          this.notifications.push(...response.data.items)
        }
        this.hasMore = response.data.hasMore
      } catch (error) {
        this.$message.error('获取通知列表失败')
      } finally {
        this.loading = false
      }
    },
    handleTypeChange() {
      this.page = 1
      this.fetchNotifications()
    },
    async loadMore() {
      this.page++
      await this.fetchNotifications()
    },
    getNotificationIcon(type) {
      const icons = {
        system: 'Bell',
        comment: 'ChatDotRound',
        like: 'Star',
        follow: 'User'
      }
      return icons[type] || 'Bell'
    },
    formatTime(time) {
      return formatDistanceToNow(new Date(time), {
        addSuffix: true,
        locale: zhCN
      })
    },
    getTargetText(notification) {
      const types = {
        post: '查看帖子',
        comment: '查看评论',
        user: '查看用户'
      }
      return types[notification.target.type] || '查看详情'
    },
    async handleNotificationClick(notification) {
      if (!notification.read) {
        await this.markAsRead(notification)
      }
      this.handleTargetClick(notification)
    },
    async handleTargetClick(notification) {
      const { type, id } = notification.target
      switch (type) {
        case 'post':
          this.$router.push(`/posts/${id}`)
          break
        case 'comment':
          this.$router.push(`/posts/${notification.target.postId}#comment-${id}`)
          break
        case 'user':
          this.$router.push(`/users/${id}`)
          break
      }
    },
    async markAsRead(notification) {
      try {
        await http.put(`/notifications/${notification.id}/read`)
        notification.read = true
      } catch (error) {
        this.$message.error('标记已读失败')
      }
    },
    async markAllRead() {
      try {
        await http.put('/notifications/read-all')
        this.notifications.forEach(n => n.read = true)
        this.$message.success('已全部标为已读')
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    async deleteNotification(notification) {
      try {
        await this.$confirm('确定要删除这条通知吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await http.delete(`/notifications/${notification.id}`)
        const index = this.notifications.findIndex(n => n.id === notification.id)
        if (index !== -1) {
          this.notifications.splice(index, 1)
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    async clearAll() {
      try {
        await this.$confirm('确定要清空所有通知吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await http.delete('/notifications')
        this.notifications = []
        this.$message.success('通知已清空')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('清空失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.notification-list {
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 24px;
      color: var(--text-color);
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .filter-bar {
    margin-bottom: 20px;
  }

  .notification-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .notification-item {
    display: flex;
    gap: 15px;
    padding: 15px;
    background-color: var(--background-color-light);
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--background-color-hover);
    }

    &.unread {
      background-color: var(--background-color-active);
    }
  }

  .notification-content {
    flex: 1;
    min-width: 0;
  }

  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;

    .sender {
      font-weight: bold;
      color: var(--text-color);
    }

    .time {
      font-size: 12px;
      color: var(--text-color-secondary);
    }
  }

  .notification-body {
    color: var(--text-color);
    margin-bottom: 5px;
  }

  .notification-target {
    font-size: 12px;
    color: var(--primary-color);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .notification-actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
  }

  .load-more {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style> 