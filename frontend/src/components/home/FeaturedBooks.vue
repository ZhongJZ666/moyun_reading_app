<template>
  <div class="featured-books">
    <div class="section-header">
      <h2>精选图书</h2>
      <el-button type="text" @click="handleViewAll">查看全部</el-button>
    </div>
    <div class="books-grid">
      <el-card
        v-for="book in books"
        :key="book.id"
        class="book-card"
        :body-style="{ padding: '0' }"
        @click="handleBookClick(book)"
      >
        <div class="book-cover">
          <el-image :src="book.cover" fit="cover">
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <div class="book-stats">
            <el-rate
              v-model="book.rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
            <span class="readers-count">{{ book.readerCount }}人在读</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Picture } from '@element-plus/icons-vue'

export default {
  name: 'FeaturedBooks',
  components: {
    Picture
  },
  props: {
    books: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleViewAll() {
      this.$emit('view-all')
    },
    handleBookClick(book) {
      this.$emit('book-click', book)
    }
  }
}
</script>

<style scoped>
.featured-books {
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

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.book-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  height: 280px;
  overflow: hidden;
}

.book-cover .el-image {
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

.book-info {
  padding: 15px;
}

.book-title {
  margin: 0 0 5px;
  font-size: 16px;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  margin: 0 0 10px;
  font-size: 14px;
  color: var(--text-color-secondary);
}

.book-stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.readers-count {
  font-size: 12px;
  color: var(--text-color-secondary);
}
</style> 