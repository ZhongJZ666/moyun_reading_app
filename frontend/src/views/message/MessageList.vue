<template>
  <div class="message-list">
    <div class="message-header">
      <h2>消息列表</h2>
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
          清空消息
        </el-button>
      </div>
    </div>

    <!-- 消息类型筛选 -->
    <div class="filter-bar">
      <el-radio-group v-model="activeType" @change="handleTypeChange">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="private">私信</el-radio-button>
        <el-radio-button label="group">群聊</el-radio-button>
        <el-radio-button label="system">系统消息</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 消息列表 -->
    <div class="message-items">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message-item"
        :class="{ unread: !message.read }"
        @click="handleMessageClick(message)"
      >
        <div class="message-icon">
          <el-avatar
            :size="40"
            :src="message.sender?.avatar"
          >
            <el-icon>
              <component :is="getMessageIcon(message.type)" />
            </el-icon>
          </el-avatar>
        </div>

        <div class="message-content">
          <div class="message-header">
            <span class="sender">{{ message.sender?.username || '系统' }}</span>
            <span class="time">{{ formatTime(message.createTime) }}</span>
          </div>
          <div class="message-body">
            {{ message.content }}
          </div>
        </div>

        <div class="message-actions">
          <el-button
            v-if="!message.read"
            type="primary"
            link
            @click.stop="markAsRead(message)"
          >
            标为已读
          </el-button>
          <el-button
            type="danger"
            link
            @click.stop="deleteMessage(message)"
          >
            删除
          </el-button>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="messages.length === 0"
        description="暂无消息"
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
import { Bell, ChatDotRound, User } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default {
  name: 'MessageList',
  components: {
    Bell,
    ChatDotRound,
    User
  },
  data() {
    return {
      messages: [],
      activeType: 'all',
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 20
    }
  },
  created() {
    this.fetchMessages()
  },
  methods: {
    async fetchMessages() {
      this.loading = true
      try {
        const response = await this.$http.get('/api/messages', {
          params: {
            page: this.page,
            size: this.pageSize,
            type: this.activeType === 'all' ? undefined : this.activeType
          }
        })
        if (this.page === 1) {
          this.messages = response.data.items
        } else {
          this.messages.push(...response.data.items)
        }
        this.hasMore = response.data.hasMore
      } catch (error) {
        this.$message.error('获取消息列表失败')
      } finally {
        this.loading = false
      }
    },
    handleTypeChange() {
      this.page = 1
      this.fetchMessages()
    },
    async loadMore() {
      this.page++
      await this.fetchMessages()
    },
    getMessageIcon(type) {
      const icons = {
        system: 'Bell',
        private: 'ChatDotRound',
        group: 'User'
      }
      return icons[type] || 'Bell'
    },
    formatTime(time) {
      return formatDistanceToNow(new Date(time), {
        addSuffix: true,
        locale: zhCN
      })
    },
    async handleMessageClick(message) {
      if (!message.read) {
        await this.markAsRead(message)
      }
      this.$router.push(`/messages/${message.id}`)
    },
    async markAsRead(message) {
      try {
        await this.$http.put(`/api/messages/${message.id}/read`)
        message.read = true
      } catch (error) {
        this.$message.error('标记已读失败')
      }
    },
    async markAllRead() {
      try {
        await this.$http.put('/api/messages/read-all')
        this.messages.forEach(m => m.read = true)
        this.$message.success('已全部标为已读')
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    async deleteMessage(message) {
      try {
        await this.$confirm('确定要删除这条消息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$http.delete(`/api/messages/${message.id}`)
        const index = this.messages.findIndex(m => m.id === message.id)
        if (index !== -1) {
          this.messages.splice(index, 1)
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    async clearAll() {
      try {
        await this.$confirm('确定要清空所有消息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$http.delete('/api/messages')
        this.messages = []
        this.$message.success('消息已清空')
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
.message-list {
  .message-header {
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

  .message-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .message-item {
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

  .message-content {
    flex: 1;
    min-width: 0;
  }

  .message-header {
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

  .message-body {
    color: var(--text-color);
    margin-bottom: 5px;
  }

  .message-actions {
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