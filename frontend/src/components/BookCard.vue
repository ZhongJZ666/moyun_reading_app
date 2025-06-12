<template>
    <el-card class="book-card" shadow="hover" @click="goToDetail">
      <div class="cover-wrapper">
        <img :src="book?.cover_url || defaultCover" :alt="book?.title || '书籍封面'" class="cover">
        <div v-if="showRecommender && book?.recommender_name" class="recommender">
          推荐人: {{ book.recommender_name }}
        </div>
      </div>
      
      <div class="content">
        <h3 class="title">{{ book?.title || '未知书名' }}</h3>
        <p class="author">{{ book?.author || '未知作者' }}</p>
        <p class="desc">{{ truncate(book?.description, 60) }}</p>
      </div>
    </el-card>
  </template>
  
  <script>
  import defaultCover from '@/assets/default-book-cover.jpg';
  
  export default {
    name: 'BookCard',
    props: {
      book: {
        type: Object,
        required: true
      },
      showRecommender: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return { defaultCover };
    },
    methods: {
      goToDetail() {
        if (this.book?.id) {
          this.$router.push(`/books/${this.book.id}`);
        }
      },
      truncate(text, length) {
        if (!text) return '暂无描述';
        return text.length > length 
          ? text.substring(0, length) + '...' 
          : text;
      }
    }
  };
  </script>
  
  <style scoped>
  .book-card {
    width: 200px;
    margin: 10px;
    cursor: pointer;
  }
  
  .cover-wrapper {
    position: relative;
    height: 180px;
  }
  
  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .recommender {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 5px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 12px;
  }
  
  .content {
    padding: 10px 0;
  }
  
  .title {
    margin: 0;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .author {
    margin: 5px 0;
    color: #666;
    font-size: 14px;
  }
  
  .desc {
    margin: 0;
    color: #999;
    font-size: 12px;
    line-height: 1.5;
  }
  </style>