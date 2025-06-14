<template>
  <div class="my-books-container">
    <h2>我的书库</h2>
    <el-divider />
    <div v-if="books.length === 0">
      <el-empty description="暂无已添加的书籍" />
    </div>
    <div v-else class="book-list">
      <el-card v-for="book in books" :key="book.id" class="book-card">
        <img :src="'/' + book.cover_url" class="cover" />
        <div class="info">
          <h3>{{ book.title }}</h3>
          <p>{{ book.author }}</p>
          <el-button type="danger" size="mini" @click="remove(book.id)">移除</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import userBooksApi from '@/api/userBooks'
import BookAPI from '@/api/books'

export default {
  name: 'MyBooks',
  data() {
    return {
      books: []
    }
  },
  async created() {
    await this.fetchMyBooks()
  },
  methods: {
    async fetchMyBooks() {
      const userBooks = await userBooksApi.getBooks()
      const allBooks = await BookAPI.getAll()
      this.books = allBooks.items.filter(b => userBooks.some(ub => ub.book_id === b.id))
    },
    async remove(bookId) {
      await userBooksApi.removeBook(bookId)
      this.$message.success('已移除')
      await this.fetchMyBooks()
    }
  }
}
</script>

<style scoped>
.my-books-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
.book-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.book-card {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cover {
  width: 100px;
  height: 140px;
  object-fit: cover;
  margin-bottom: 10px;
}
.info {
  text-align: center;
}
</style> 