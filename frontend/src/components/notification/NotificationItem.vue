<template>
  <div
    class="notification-item"
    :class="{ unread: !notification.read }"
    @click="handleClick"
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
        @click.stop="handleTargetClick"
      >
        {{ getTargetText(notification) }}
      </div>
    </div>

    <div class="notification-actions">
      <el-button
        v-if="!notification.read"
        type="primary"
        link
        @click.stop="handleMarkAsRead"
      >
        标为已读
      </el-button>
      <el-button
        type="danger"
        link
        @click.stop="handleDelete"
      >
        删除
      </el-button>
    </div>
  </div>
</template>

<script>
import { Bell, ChatDotRound, Star, User } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default {
  name: 'NotificationItem',
  components: {
    Bell,
    ChatDotRound,
    Star,
    User
  },
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  emits: ['read', 'delete', 'click'],
  methods: {
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
    async handleClick() {
      if (!this.notification.read) {
        await this.handleMarkAsRead()
      }
      this.$emit('click', this.notification)
    },
    async handleMarkAsRead() {
      try {
        await this.$http.put(`/api/notifications/${this.notification.id}/read`)
        this.notification.read = true
        this.$emit('read', this.notification)
      } catch (error) {
        this.$message.error('标记已读失败')
      }
    },
    async handleDelete() {
      try {
        await this.$confirm('确定要删除这条通知吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$http.delete(`/api/notifications/${this.notification.id}`)
        this.$emit('delete', this.notification)
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    handleTargetClick() {
      const { type, id } = this.notification.target
      switch (type) {
        case 'post':
          this.$router.push(`/posts/${id}`)
          break
        case 'comment':
          this.$router.push(`/posts/${this.notification.target.postId}#comment-${id}`)
          break
        case 'user':
          this.$router.push(`/users/${id}`)
          break
      }
    }
  }
}
</script>

<style scoped>
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
</style> 