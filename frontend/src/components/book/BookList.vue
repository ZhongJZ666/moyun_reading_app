<template>
  <div class="book-list">
    <!-- 筛选和排序 -->
    <div class="filter-bar">
      <div class="left">
        <el-select
          v-model="filter.category"
          placeholder="选择分类"
          clearable
          @change="handleFilterChange"
        >
          <el-option
            v-for="category in categories"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>

        <el-select
          v-model="filter.status"
          placeholder="阅读状态"
          clearable
          @change="handleFilterChange"
        >
          <el-option label="在读" value="reading" />
          <el-option label="已读完" value="finished" />
          <el-option label="想读" value="wish" />
        </el-select>

        <el-select
          v-model="filter.sort"
          placeholder="排序方式"
          @change="handleFilterChange"
        >
          <el-option label="最新添加" value="latest" />
          <el-option label="最多阅读" value="popular" />
          <el-option label="最高评分" value="rating" />
        </el-select>
      </div>

      <div class="right">
        <el-input
          v-model="searchQuery"
          placeholder="搜索书籍"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 书籍列表 -->
    <div class="books-grid">
      <el-card
        v-for="book in books"
        :key="book.id"
        class="book-card"
        :body-style="{ padding: '0px' }"
        @click="handleBookClick(book)"
      >
        <div class="book-cover">
          <el-image
            :src="book.cover"
            fit="cover"
          >
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="book-status" v-if="book.status">
            <el-tag
              :type="getStatusType(book.status)"
              effect="plain"
              size="small"
            >
              {{ getStatusText(book.status) }}
            </el-tag>
          </div>
        </div>

        <div class="book-info">
          <h3 class="title">{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <div class="meta">
            <span class="rating">
              <el-rate
                v-model="book.rating"
                disabled
                text-color="#ff9900"
              />
              <span class="rating-text">{{ book.rating.toFixed(1) }}</span>
            </span>
            <span class="readers">
              <el-icon><User /></el-icon>
              {{ book.readerCount }}
            </span>
          </div>
          <p class="description">{{ book.description }}</p>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 36, 48]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { Search, Picture, User } from '@element-plus/icons-vue'

export default {
  name: 'BookList',
  components: {
    Search,
    Picture,
    User
  },
  data() {
    return {
      loading: false,
      books: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 12,
      total: 0,
      filter: {
        category: '',
        status: '',
        sort: 'latest'
      },
      categories: [
        { label: '文学', value: 'literature' },
        { label: '历史', value: 'history' },
        { label: '哲学', value: 'philosophy' },
        { label: '艺术', value: 'art' },
        { label: '科技', value: 'technology' },
        { label: '生活', value: 'life' }
      ]
    }
  },
  created() {
    this.fetchBooks()
  },
  methods: {
    async fetchBooks() {
      this.loading = true
      try {
        const response = await this.$http.get('/api/books', {
          params: {
            page: this.currentPage,
            size: this.pageSize,
            search: this.searchQuery,
            ...this.filter
          }
        })
        this.books = response.data.items
        this.total = response.data.total
      } catch (error) {
        this.$message.error('获取书籍列表失败')
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchBooks()
    },
    handleFilterChange() {
      this.currentPage = 1
      this.fetchBooks()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchBooks()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchBooks()
    },
    handleBookClick(book) {
      this.$router.push(`/books/${book.id}`)
    },
    getStatusType(status) {
      const types = {
        reading: 'primary',
        finished: 'success',
        wish: 'info'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        reading: '在读',
        finished: '已读完',
        wish: '想读'
      }
      return texts[status] || ''
    }
  }
}
</script>

<style scoped>
.book-list {
  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .left {
      display: flex;
      gap: 10px;
    }

    .right {
      width: 200px;
    }
  }

  .books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }

  .book-card {
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .book-cover {
    position: relative;
    height: 280px;

    .el-image {
      width: 100%;
      height: 100%;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--background-color);
      color: var(--text-color-secondary);
    }

    .book-status {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }

  .book-info {
    padding: 15px;

    .title {
      margin: 0 0 5px;
      font-size: 16px;
      color: var(--text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .author {
      margin: 0 0 10px;
      font-size: 14px;
      color: var(--text-color-secondary);
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .rating {
        display: flex;
        align-items: center;
        gap: 5px;

        .rating-text {
          font-size: 14px;
          color: #ff9900;
        }
      }

      .readers {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        color: var(--text-color-secondary);
      }
    }

    .description {
      margin: 0;
      font-size: 12px;
      color: var(--text-color-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
  }
}
</style> 