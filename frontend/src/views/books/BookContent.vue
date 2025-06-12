<template>
  <div class="book-content-container" v-loading="loading">
    <el-page-header @back="$router.back()" content="返回" />
    <div v-if="error">
      <el-alert :title="error" type="error" show-icon :closable="false" />
    </div>
    <div v-else-if="book">
      <h1>{{ book.title }}</h1>
      <p class="author">作者：{{ book.author }}</p>
      <el-divider />
      <div class="book-content-text">
        <pre>{{ book.content }}</pre>
      </div>
    </div>
    <div v-else>
      <el-empty description="未找到书籍内容" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'BookContent',
  data() {
    return {
      bookId: this.$route.params.id,
      loading: false,
      error: null,
      book: null
    }
  },
  async created() {
    this.loading = true
    try {
      await this.fetchBookDetail(this.bookId)
      this.book = this.$store.state.books.currentBook
    } catch (e) {
      this.error = '获取书籍内容失败'
    } finally {
      this.loading = false
    }
  },
  methods: {
    ...mapActions('books', ['fetchBookDetail'])
  }
}
</script>

<style scoped>
.book-content-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}
.author {
  color: #666;
  margin-bottom: 20px;
}
.book-content-text {
  background: #f8f8f8;
  padding: 24px;
  border-radius: 8px;
  font-size: 16px;
  white-space: pre-wrap;
  line-height: 1.8;
}
</style> 