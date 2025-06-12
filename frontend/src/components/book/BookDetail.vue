<template>
  <div class="book-detail">
    <el-card class="book-info-card">
      <div class="book-header">
        <div class="book-cover">
          <el-image :src="book.cover" fit="cover" :alt="book.title">
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="book-meta">
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-author">作者：{{ book.author }}</p>
          <div class="book-rating">
            <el-rate
              v-model="book.rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
            <span class="rating-count">({{ book.ratingCount }}人评分)</span>
          </div>
          <div class="book-stats">
            <div class="stat-item">
              <el-icon><User /></el-icon>
              <span>{{ book.readerCount }}人在读</span>
            </div>
            <div class="stat-item">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ book.reviewCount }}条评价</span>
            </div>
          </div>
          <div class="book-tags" v-if="book.tags && book.tags.length">
            <el-tag
              v-for="tag in book.tags"
              :key="tag"
              class="book-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div class="book-actions">
            <el-button type="primary" @click="handleStartReading">
              开始阅读
            </el-button>
            <el-button @click="handleAddToShelf">
              加入书架
            </el-button>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeTab" class="book-tabs">
        <el-tab-pane label="简介" name="intro">
          <div class="book-intro">
            <p>{{ book.description }}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="目录" name="catalog">
          <div class="book-catalog">
            <div
              v-for="chapter in book.chapters"
              :key="chapter.id"
              class="chapter-item"
              @click="handleChapterClick(chapter)"
            >
              <span class="chapter-title">{{ chapter.title }}</span>
              <span class="chapter-page">{{ chapter.pageCount }}页</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="评价" name="reviews">
          <div class="book-reviews">
            <div class="review-header">
              <h3>读者评价</h3>
              <el-button type="primary" @click="handleWriteReview">
                写评价
              </el-button>
            </div>
            <div class="review-list">
              <div
                v-for="review in book.reviews"
                :key="review.id"
                class="review-item"
              >
                <div class="review-user">
                  <el-avatar :size="40" :src="review.user.avatar" :alt="review.user.username">
                    <el-icon><User /></el-icon>
                  </el-avatar>
                  <div class="review-user-info">
                    <span class="username">{{ review.user.username }}</span>
                    <el-rate
                      v-model="review.rating"
                      disabled
                      size="small"
                    />
                  </div>
                </div>
                <p class="review-content">{{ review.content }}</p>
                <div class="review-footer">
                  <span class="review-time">{{ review.createTime }}</span>
                  <div class="review-actions">
                    <el-button type="text" @click="handleLikeReview(review)">
                      <el-icon><Thumb /></el-icon>
                      <span>{{ review.likeCount }}</span>
                    </el-button>
                    <el-button type="text" @click="handleReplyReview(review)">
                      <el-icon><ChatDotRound /></el-icon>
                      <span>回复</span>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { Picture, User, ChatDotRound, Thumb } from '@element-plus/icons-vue'

export default {
  name: 'BookDetail',
  components: {
    Picture,
    User,
    ChatDotRound,
    Thumb
  },
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTab: 'intro'
    }
  },
  methods: {
    handleStartReading() {
      this.$emit('start-reading', this.book)
    },
    handleAddToShelf() {
      this.$emit('add-to-shelf', this.book)
    },
    handleChapterClick(chapter) {
      this.$emit('chapter-click', chapter)
    },
    handleWriteReview() {
      this.$emit('write-review')
    },
    handleLikeReview(review) {
      this.$emit('like-review', review)
    },
    handleReplyReview(review) {
      this.$emit('reply-review', review)
    }
  }
}
</script>

<style scoped>
.book-detail {
  padding: 20px;
}

.book-info-card {
  margin-bottom: 20px;
}

.book-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.book-cover {
  width: 240px;
  height: 360px;
  flex-shrink: 0;
}

.book-cover .el-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color-light);
  color: var(--text-color-secondary);
  border-radius: 8px;
}

.book-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.book-title {
  margin: 0;
  font-size: 28px;
  color: var(--text-color);
}

.book-author {
  margin: 0;
  font-size: 16px;
  color: var(--text-color-secondary);
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-count {
  color: var(--text-color-secondary);
  font-size: 14px;
}

.book-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-color-secondary);
}

.book-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.book-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.book-tabs {
  margin-top: 20px;
}

.book-intro {
  line-height: 1.8;
  color: var(--text-color);
}

.book-catalog {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chapter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chapter-item:hover {
  background-color: var(--background-color-light);
}

.chapter-title {
  color: var(--text-color);
}

.chapter-page {
  color: var(--text-color-secondary);
  font-size: 14px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.review-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  padding: 15px;
  border-radius: 8px;
  background-color: var(--background-color-light);
}

.review-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.review-user-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.username {
  font-weight: bold;
  color: var(--text-color);
}

.review-content {
  margin: 0 0 10px;
  color: var(--text-color);
  line-height: 1.6;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-time {
  color: var(--text-color-secondary);
  font-size: 12px;
}

.review-actions {
  display: flex;
  gap: 15px;
}
</style> 