<template>
    <div class="book-detail-container" v-loading="loading">
      <template v-if="error">
        <el-alert
          :title="error"
          type="error"
          show-icon
          :closable="false"
        />
      </template>
      <template v-else-if="book">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="book-cover">
              <el-image 
                :src="getCoverUrl(book.cover_url)" 
                :alt="book?.title || '书籍封面'"
                fit="cover"
                :preview-src-list="[getCoverUrl(book.cover_url)]"
                @error="handleImageError"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                    <span>图片加载失败</span>
                  </div>
                </template>
              </el-image>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="book-info">
              <h2>{{ book?.title || '未知书名' }}</h2>
              <p class="author">作者: {{ book?.author || '未知作者' }}</p>
              <p class="recommender">推荐人: {{ book?.recommender_name || '未知推荐人' }}</p>
              
              <el-divider />
              
              <div class="description">
                <h3>内容简介</h3>
                <p>{{ book?.description || '暂无简介' }}</p>
              </div>
              
              <div class="actions">
                <el-button 
                  type="primary" 
                  @click="goToCreatePost(book.id)"
                >
                  发表读后感
                </el-button>
                <el-button 
                  type="success" 
                  @click="goToBookContent(book.id)"
                >
                  查看书籍内容
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        
        <el-divider />
        
        <div class="related-posts">
          <h3>相关读后感</h3>
          <post-list :posts="posts" />
        </div>
      </template>
      <template v-else>
        <el-empty description="未找到书籍信息" />
      </template>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex'
  import PostList from '@/components/post/PostList.vue'
  import { Picture } from '@element-plus/icons-vue'
  
  export default {
    name: 'BookDetailView',
    components: { 
      PostList,
      Picture
    },
    data() {
      return {
        defaultCover: '/images/js.jpg',
        bookId: this.$route.params.id,
        imageLoadError: false
      }
    },
    computed: {
      ...mapState('books', ['currentBook', 'loading', 'error']),
      ...mapState('posts', ['posts']),
      book() {
        return this.currentBook
      }
    },
    async created() {
      try {
        await Promise.all([
          this.fetchBookDetail(this.bookId),
          this.fetchRelatedPosts(this.bookId)
        ])
      } catch (error) {
        console.error('获取书籍详情失败:', error)
      }
    },
    methods: {
      ...mapActions('books', ['fetchBookDetail']),
      ...mapActions('posts', ['fetchRelatedPosts']),
      getCoverUrl(coverUrl) {
        if (this.imageLoadError) return this.defaultCover
        if (coverUrl) {
          // 远程图片
          if (coverUrl.startsWith('http://') || coverUrl.startsWith('https://')) {
            return coverUrl
          }
          // 本地静态图片（如 public/images/xxx.jpg）
          if (coverUrl.startsWith('/images/')) {
            return coverUrl
          }
          // 上传目录或其它相对路径
          if (coverUrl.startsWith('uploads/') || coverUrl.includes('/covers/')) {
            const cleanUrl = coverUrl.replace(/\\/g, '/')
            return `${process.env.VUE_APP_API_BASE_URL}/${cleanUrl}`
          }
        }
        // 兜底：无 cover_url 或加载失败
        return this.defaultCover
      },
      handleImageError() {
        this.imageLoadError = true
        console.warn('图片加载失败，使用默认封面')
      },
      goToCreatePost(bookId) {
        if (bookId) {
          this.$router.push({
            path: '/posts/create',
            query: { bookId }
          })
        }
      },
      goToBookContent(bookId) {
        if (bookId) {
          this.$router.push(`/books/content/${bookId}`)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .book-detail-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .book-cover {
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    background-color: #f5f7fa;
  }
  
  .book-cover .el-image {
    width: 100%;
    height: 100%;
  }
  
  .image-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #909399;
    font-size: 14px;
    background-color: #f5f7fa;
  }
  
  .image-error .el-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .book-info h2 {
    margin-top: 0;
  }
  
  .author, .recommender {
    color: #666;
    margin: 5px 0;
  }
  
  .description {
    margin: 20px 0;
  }
  
  .actions {
    margin-top: 30px;
  }
  
  .related-posts {
    margin-top: 40px;
  }
  </style>