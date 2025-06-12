<template>
  <div class="comment-list">
    <div v-for="comment in comments" :key="comment.id" class="comment-item">
      <div class="comment-header">
        <div class="user-info">
          <el-avatar :size="32" :src="comment.user.avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="user-details">
            <span class="username">{{ comment.user.username }}</span>
            <span class="comment-time">{{ comment.createTime }}</span>
          </div>
        </div>
        <el-dropdown v-if="isAuthor(comment.user.id)">
          <el-button type="text">
            <el-icon><More /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleEdit(comment)">编辑</el-dropdown-item>
              <el-dropdown-item @click="handleDelete(comment)" class="danger">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="comment-content">
        <p>{{ comment.content }}</p>
      </div>
      <div class="comment-footer">
        <el-button type="text" @click="handleLike(comment)">
          <el-icon><Thumb /></el-icon>
          <span>{{ comment.likeCount }}</span>
        </el-button>
        <el-button type="text" @click="handleReply(comment)">
          <el-icon><ChatDotRound /></el-icon>
          <span>回复</span>
        </el-button>
      </div>
      <div v-if="comment.replies && comment.replies.length" class="reply-list">
        <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
          <div class="reply-header">
            <el-avatar :size="24" :src="reply.user.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="reply-details">
              <span class="username">{{ reply.user.username }}</span>
              <span class="reply-time">{{ reply.createTime }}</span>
            </div>
          </div>
          <div class="reply-content">
            <p>{{ reply.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { User, More, Thumb, ChatDotRound } from '@element-plus/icons-vue'

export default {
  name: 'CommentList',
  components: {
    User,
    More,
    Thumb,
    ChatDotRound
  },
  props: {
    comments: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    isAuthor(userId) {
      // 这里需要根据实际用户ID判断
      return userId === 'current-user-id'
    },
    handleEdit(comment) {
      this.$emit('edit', comment)
    },
    handleDelete(comment) {
      this.$confirm('确定要删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', comment)
      })
    },
    handleLike(comment) {
      this.$emit('like', comment)
    },
    handleReply(comment) {
      this.$emit('reply', comment)
    }
  }
}
</script>

<style scoped>
.comment-list {
  margin-top: 20px;
}

.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
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

.comment-time {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.comment-content {
  margin: 10px 0;
  color: var(--text-color);
  line-height: 1.6;
}

.comment-footer {
  display: flex;
  gap: 20px;
}

.reply-list {
  margin-top: 10px;
  padding-left: 42px;
}

.reply-item {
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color-light);
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.reply-details {
  display: flex;
  flex-direction: column;
}

.reply-time {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.reply-content {
  color: var(--text-color);
  line-height: 1.5;
}

.danger {
  color: var(--danger-color);
}
</style> 