<template>
    <div class="post-detail-container">
      <el-button 
        icon="el-icon-arrow-left" 
        @click="$router.go(-1)"
        class="back-btn"
      >
        返回
      </el-button>
      
      <post-card :post="post" class="post-card" />
      
      <div class="comment-section">
        <h3>评论 ({{ comments.length }})</h3>
        <comment-form 
          :post-id="postId"
          @created="handleCommentCreated"
        />
        <comment-list :comments="comments" />
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex'
  import PostCard from '@/components/PostCard.vue'
  import CommentForm from '@/components/CommentForm.vue'
  import CommentList from '@/components/CommentList.vue'
  
  export default {
    name: 'PostDetailView',
    components: {
      PostCard,
      CommentForm,
      CommentList
    },
    data() {
      return {
        postId: this.$route.params.id
      }
    },
    computed: {
      ...mapState('posts', ['post']),
      ...mapState('comments', ['comments'])
    },
    async created() {
      await Promise.all([
        this.fetchPostDetail(this.postId),
        this.fetchComments(this.postId)
      ])
    },
    methods: {
      ...mapActions('posts', ['fetchPostDetail']),
      ...mapActions('comments', ['fetchComments', 'addComment']),
      handleCommentCreated(newComment) {
        this.addComment(newComment)
      }
    }
  }
  </script>
  
  <style scoped>
  .post-detail-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .back-btn {
    margin-bottom: 20px;
  }
  
  .post-card {
    margin-bottom: 30px;
  }
  
  .comment-section {
    margin-top: 40px;
  }
  </style>