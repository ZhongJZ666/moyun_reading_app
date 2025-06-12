<template>
  <div class="message-chat">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="user-info">
        <el-avatar
          :size="40"
          :src="targetUser?.avatar"
        />
        <div class="user-details">
          <span class="username">{{ targetUser?.username }}</span>
          <span class="status">{{ targetUser?.online ? '在线' : '离线' }}</span>
        </div>
      </div>
      <div class="header-actions">
        <el-button
          type="primary"
          link
          @click="showUserProfile"
        >
          查看资料
        </el-button>
      </div>
    </div>

    <!-- 消息列表 -->
    <div
      ref="messageContainer"
      class="message-container"
      @scroll="handleScroll"
    >
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

      <div class="message-list">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-item"
          :class="{ 'message-mine': message.senderId === currentUser.id }"
        >
          <el-avatar
            :size="36"
            :src="message.senderId === currentUser.id ? currentUser.avatar : targetUser?.avatar"
          />
          <div class="message-content">
            <div class="message-time">
              {{ formatTime(message.createTime) }}
            </div>
            <div class="message-bubble">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入框 -->
    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="输入消息..."
        :maxlength="1000"
        show-word-limit
        @keyup.enter.ctrl="sendMessage"
      />
      <div class="input-actions">
        <span class="tip">按 Ctrl + Enter 发送</span>
        <el-button
          type="primary"
          :disabled="!inputMessage.trim()"
          @click="sendMessage"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default {
  name: 'MessageChat',
  props: {
    targetUser: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      messages: [],
      inputMessage: '',
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 20,
      currentUser: this.$store.state.user
    }
  },
  created() {
    this.fetchMessages()
    this.setupWebSocket()
  },
  beforeUnmount() {
    this.cleanupWebSocket()
  },
  methods: {
    async fetchMessages() {
      this.loading = true
      try {
        const response = await this.$http.get(`/api/messages/chat/${this.targetUser.id}`, {
          params: {
            page: this.page,
            size: this.pageSize
          }
        })
        if (this.page === 1) {
          this.messages = response.data.items.reverse()
        } else {
          this.messages.unshift(...response.data.items.reverse())
        }
        this.hasMore = response.data.hasMore
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (error) {
        this.$message.error('获取消息失败')
      } finally {
        this.loading = false
      }
    },
    handleScroll() {
      const container = this.$refs.messageContainer
      if (container.scrollTop === 0 && this.hasMore) {
        this.loadMore()
      }
    },
    async loadMore() {
      this.page++
      await this.fetchMessages()
    },
    formatTime(time) {
      return formatDistanceToNow(new Date(time), {
        addSuffix: true,
        locale: zhCN
      })
    },
    async sendMessage() {
      if (!this.inputMessage.trim()) return

      try {
        const response = await this.$http.post('/api/messages', {
          receiverId: this.targetUser.id,
          content: this.inputMessage.trim()
        })
        this.messages.push(response.data)
        this.inputMessage = ''
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (error) {
        this.$message.error('发送消息失败')
      }
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer
      container.scrollTop = container.scrollHeight
    },
    showUserProfile() {
      this.$router.push(`/users/${this.targetUser.id}`)
    },
    setupWebSocket() {
      this.ws = new WebSocket(`${process.env.VUE_APP_WS_URL}/ws/messages`)
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.senderId === this.targetUser.id) {
          this.messages.push(message)
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
      }
    },
    cleanupWebSocket() {
      if (this.ws) {
        this.ws.close()
      }
    }
  }
}
</script>

<style scoped>
.message-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--background-color);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: var(--background-color-light);
  border-bottom: 1px solid var(--border-color);

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-details {
    display: flex;
    flex-direction: column;

    .username {
      font-weight: bold;
      color: var(--text-color);
    }

    .status {
      font-size: 12px;
      color: var(--text-color-secondary);
    }
  }
}

.message-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-item {
  display: flex;
  gap: 10px;
  max-width: 80%;

  &.message-mine {
    flex-direction: row-reverse;
    align-self: flex-end;

    .message-content {
      align-items: flex-end;
    }

    .message-bubble {
      background-color: var(--primary-color);
      color: white;
    }
  }
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.message-time {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.message-bubble {
  padding: 10px 15px;
  background-color: var(--background-color-light);
  border-radius: 8px;
  word-break: break-word;
}

.chat-input {
  padding: 15px;
  background-color: var(--background-color-light);
  border-top: 1px solid var(--border-color);

  .input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;

    .tip {
      font-size: 12px;
      color: var(--text-color-secondary);
    }
  }
}
</style> 