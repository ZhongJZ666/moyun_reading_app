<template>
    <el-card class="post-card">
      <div class="header">
        <el-avatar :size="40" :src="post.author_avatar" />
        <div class="author-info">
          <span class="name">{{ post.author_name }}</span>
          <span class="time">{{ formatTime(post.created_at) }}</span>
        </div>
      </div>
  
      <div class="content">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
      </div>
  
      <div class="footer">
        <el-button 
          :icon="post.is_liked ? 'el-icon-star-on' : 'el-icon-star-off'" 
          size="mini"
          @click="toggleLike"
        >
          {{ post.like_count || 0 }}
        </el-button>
        <el-button 
          icon="el-icon-chat-line-round" 
          size="mini"
          @click="showComments"
        >
          {{ post.comment_count || 0 }}
        </el-button>
      </div>
    </el-card>
  </template>
  
  <script>
  import { format } from 'date-fns';
  
  export default {
    name: 'PostCard',
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatTime(timestamp) {
        return format(new Date(timestamp), 'yyyy-MM-dd HH:mm');
      },
      toggleLike() {
        this.$emit('like', this.post.id);
      },
      showComments() {
        this.$emit('show-comments', this.post.id);
      }
    }
  };
  </script>
  
  <style scoped>
  .post-card {
    margin-bottom: 20px;
  }
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .author-info {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
  }
  
  .name {
    font-weight: bold;
  }
  
  .time {
    font-size: 12px;
    color: #999;
  }
  
  .content {
    margin: 15px 0;
  }
  
  .content h3 {
    margin: 0 0 10px;
    font-size: 16px;
  }
  
  .content p {
    margin: 0;
    color: #333;
    line-height: 1.6;
  }
  
  .footer {
    margin-top: 15px;
  }
  </style>