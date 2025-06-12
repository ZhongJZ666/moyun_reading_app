<template>
  <div class="book-carousel">
    <el-carousel :interval="4000" type="card" height="400px">
      <el-carousel-item v-for="book in books" :key="book.id">
        <div class="carousel-content" @click="handleBookClick(book)">
          <el-image :src="book.cover" fit="cover" class="book-cover" :alt="book.title">
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <p class="book-description">{{ book.description }}</p>
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
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { Picture } from '@element-plus/icons-vue'

export default {
  name: 'BookCarousel',
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
    handleBookClick(book) {
      this.$emit('book-click', book)
    }
  }
}
</script>

<style scoped>
.book-carousel {
  margin-bottom: 30px;
}

.carousel-content {
  height: 100%;
  display: flex;
  cursor: pointer;
  background-color: var(--background-color);
  border-radius: 8px;
  overflow: hidden;
}

.book-cover {
  width: 50%;
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
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.book-title {
  margin: 0 0 10px;
  font-size: 24px;
  color: var(--text-color);
}

.book-author {
  margin: 0 0 15px;
  font-size: 16px;
  color: var(--text-color-secondary);
}

.book-description {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-stats {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.readers-count {
  font-size: 14px;
  color: var(--text-color-secondary);
}

:deep(.el-carousel__item) {
  border-radius: 8px;
  overflow: hidden;
}
</style> 