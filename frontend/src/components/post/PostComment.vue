<template>
  <div class="post-comment">
    <div class="comment-header">
      <h3>评论 ({{ total }})</h3>
      <el-button
        v-if="!showCommentForm"
        type="primary"
        size="small"
        @click="showCommentForm = true"
      >
        写评论
      </el-button>
    </div>

    <!-- 评论输入框 -->
    <div v-if="showCommentForm" class="comment-form">
      <el-input
        v-model="commentContent"
        type="textarea"
        :rows="3"
        placeholder="写下你的评论..."
        :maxlength="500"
        show-word-limit
      />
      <div class="form-footer">
        <el-button @click="cancelComment">取消</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          :disabled="!commentContent.trim()"
          @click="submitComment"
        >
          发表评论
        </el-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="comment-item"
      >
        <div class="comment-user">
          <el-avatar :size="40" :src="comment.user.avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="user-info">
            <span class="username">{{ comment.user.username }}</span>
            <span class="comment-time">{{ comment.createTime }}</span>
          </div>
        </div>
        <div class="comment-content">
          <p>{{ comment.content }}</p>
          <div class="comment-actions">
            <el-button type="text" @click="handleLike(comment)">
              <el-icon><Thumb /></el-icon>
              <span>{{ comment.likeCount }}</span>
            </el-button>
            <el-button type="text" @click="handleReply(comment)">
              <el-icon><ChatDotRound /></el-icon>
              <span>回复</span>
            </el-button>
            <el-button
              v-if="isAuthor(comment.user.id)"
              type="text"
              class="danger"
              @click="handleDelete(comment)"
            >
              删除
            </el-button>
          </div>
        </div>

        <!-- 回复列表 -->
        <div v-if="comment.replies && comment.replies.length" class="reply-list">
          <div
            v-for="reply in comment.replies"
            :key="reply.id"
            class="reply-item"
          >
            <div class="reply-user">
              <el-avatar :size="32" :src="reply.user.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="user-info">
                <span class="username">{{ reply.user.username }}</span>
                <span class="reply-time">{{ reply.createTime }}</span>
              </div>
            </div>
            <div class="reply-content">
              <p>
                <template v-if="reply.replyTo">
                  回复 <span class="reply-to">@{{ reply.replyTo.username }}</span>：
                </template>
                {{ reply.content }}
              </p>
              <div class="reply-actions">
                <el-button type="text" @click="handleLike(reply)">
                  <el-icon><Thumb /></el-icon>
                  <span>{{ reply.likeCount }}</span>
                </el-button>
                <el-button type="text" @click="handleReply(comment, reply)">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>回复</span>
                </el-button>
                <el-button
                  v-if="isAuthor(reply.user.id)"
                  type="text"
                  class="danger"
                  @click="handleDelete(reply)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 回复输入框 -->
        <div v-if="activeReplyId === comment.id" class="reply-form">
          <el-input
            v-model="replyContent"
            type="textarea"
            :rows="2"
            :placeholder="replyTo ? `回复 @${replyTo.username}` : '写下你的回复...'"
            :maxlength="200"
            show-word-limit
          />
          <div class="form-footer">
            <el-button @click="cancelReply">取消</el-button>
            <el-button
              type="primary"
              :loading="submitting"
              :disabled="!replyContent.trim()"
              @click="submitReply(comment)"
            >
              发表回复
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more">
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
import { User, Thumb, ChatDotRound } from '@element-plus/icons-vue'

export default {
  name: 'PostComment',
  components: {
    User,
    Thumb,
    ChatDotRound
  },
  props: {
    comments: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    hasMore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showCommentForm: false,
      commentContent: '',
      activeReplyId: null,
      replyContent: '',
      replyTo: null,
      submitting: false,
      loading: false
    }
  },
  methods: {
    isAuthor(userId) {
      // 这里需要根据实际用户ID判断
      return userId === 'current-user-id'
    },
    async submitComment() {
      if (!this.commentContent.trim()) return

      this.submitting = true
      try {
        await this.$emit('submit', {
          content: this.commentContent,
          type: 'comment'
        })
        this.commentContent = ''
        this.showCommentForm = false
      } finally {
        this.submitting = false
      }
    },
    cancelComment() {
      this.commentContent = ''
      this.showCommentForm = false
    },
    handleLike(item) {
      this.$emit('like', item)
    },
    handleReply(comment, reply = null) {
      this.activeReplyId = comment.id
      this.replyTo = reply
      this.replyContent = ''
    },
    async submitReply(comment) {
      if (!this.replyContent.trim()) return

      this.submitting = true
      try {
        await this.$emit('submit', {
          content: this.replyContent,
          type: 'reply',
          commentId: comment.id,
          replyTo: this.replyTo
        })
        this.replyContent = ''
        this.activeReplyId = null
        this.replyTo = null
      } finally {
        this.submitting = false
      }
    },
    cancelReply() {
      this.replyContent = ''
      this.activeReplyId = null
      this.replyTo = null
    },
    handleDelete(item) {
      this.$confirm('确定要删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', item)
      })
    },
    async loadMore() {
      this.loading = true
      try {
        await this.$emit('load-more')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.post-comment {
  margin-top: 20px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comment-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.comment-form {
  margin-bottom: 20px;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  padding: 15px;
  border-radius: 8px;
  background-color: var(--background-color-light);
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  color: var(--text-color);
}

.comment-time,
.reply-time {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.comment-content {
  margin-left: 50px;
}

.comment-content p {
  margin: 0 0 10px;
  color: var(--text-color);
  line-height: 1.6;
}

.comment-actions,
.reply-actions {
  display: flex;
  gap: 15px;
}

.reply-list {
  margin: 15px 0 0 50px;
  padding-left: 15px;
  border-left: 2px solid var(--border-color);
}

.reply-item {
  margin-bottom: 15px;
}

.reply-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.reply-content {
  margin-left: 40px;
}

.reply-content p {
  margin: 0 0 5px;
  color: var(--text-color);
  line-height: 1.6;
}

.reply-to {
  color: var(--el-color-primary);
  font-weight: bold;
}

.reply-form {
  margin: 15px 0 0 50px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.danger {
  color: var(--danger-color);
}
</style> 