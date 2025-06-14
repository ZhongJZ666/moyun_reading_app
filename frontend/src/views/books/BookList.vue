<template>
    <div class="book-list-container">
      <div class="header">
        <h2>书库</h2>
        <el-button 
          v-if="isMentor" 
          type="primary" 
          @click="goToRecommend"
        >
          推荐书籍
        </el-button>
        <el-button 
          v-if="isMentor || isStudent" 
          type="success" 
          @click="goToMyBooks"
        >
          我的书库
        </el-button>
      </div>
      
      <el-divider />
      
      <div class="filter-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索书名或作者"
          clearable
          style="width: 300px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
  
      <div v-loading="loading" class="book-grid">
        <template v-if="error">
          <el-alert
            :title="error"
            type="error"
            show-icon
            :closable="false"
          />
        </template>
        <template v-else-if="books && books.length > 0">
          <book-card
            v-for="book in books"
            :key="book.id"
            :book="book"
            @click.native="goToDetail(book.id)"
          >
            <template #footer>
              <el-button 
                v-if="(isMentor || isStudent) && !isInMyBooks(book.id)" 
                size="mini" 
                type="success" 
                @click.stop="addToMyBooks(book.id)"
              >
                加入我的书库
              </el-button>
              <el-button 
                v-if="(isMentor || isStudent) && isInMyBooks(book.id)" 
                size="mini" 
                type="info" 
                disabled
              >
                已添加
              </el-button>
            </template>
          </book-card>
        </template>
        <template v-else>
          <el-empty description="暂无书籍" />
        </template>
      </div>
  
      <el-pagination
        v-if="total > 0"
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handlePageChange"
      />
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import BookCard from '@/components/BookCard.vue'
  import userBooksApi from '@/api/userBooks'
  
  export default {
    name: 'BookListView',
    components: { BookCard },
    data() {
      return {
        searchQuery: '',
        page: 1,
        pageSize: 12,
        myBookIds: []
      }
    },
    computed: {
      ...mapState('books', ['books', 'loading', 'error']),
      ...mapGetters('auth', ['isMentor', 'userRole']),
      isStudent() {
        return this.userRole === 'student'
      },
      total() {
        return this.books?.length || 0
      }
    },
    async created() {
      await this.fetchBooks()
      await this.fetchMyBooks()
    },
    methods: {
      ...mapActions('books', ['fetchBooks']),
      goToDetail(bookId) {
        if (bookId) {
          this.$router.push(`/books/${bookId}`)
        }
      },
      goToRecommend() {
        this.$router.push('/recommend')
      },
      goToMyBooks() {
        this.$router.push('/my-books')
      },
      async handleSearch() {
        this.page = 1
        try {
          await this.fetchBooks({
            query: this.searchQuery,
            page: this.page,
            pageSize: this.pageSize
          })
        } catch (error) {
          console.error('搜索书籍失败:', error)
        }
      },
      async handlePageChange(page) {
        this.page = page
        try {
          await this.fetchBooks({
            query: this.searchQuery,
            page: this.page,
            pageSize: this.pageSize
          })
        } catch (error) {
          console.error('切换页面失败:', error)
        }
      },
      async fetchMyBooks() {
        const userBooks = await userBooksApi.getBooks()
        this.myBookIds = userBooks.map(ub => ub.book_id)
      },
      isInMyBooks(bookId) {
        return this.myBookIds.includes(bookId)
      },
      async addToMyBooks(bookId) {
        await userBooksApi.addBook(bookId)
        this.$message.success('已加入我的书库')
        await this.fetchMyBooks()
      }
    }
  }
  </script>
  
  <style scoped>
  .book-list-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .filter-bar {
    margin: 20px 0;
  }
  
  .book-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }
  
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
  </style>