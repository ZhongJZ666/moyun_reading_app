<template>
    <div class="create-post-container">
      <h2>发表读后感</h2>
      <el-divider />
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="postForm"
        @submit.native.prevent="handleSubmit"
      >
        <el-form-item prop="title">
          <el-input
            v-model="form.title"
            placeholder="标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="10"
            placeholder="写下你的读后感..."
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            native-type="submit"
            :loading="loading"
          >
            发布
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  
  export default {
    name: 'CreatePostView',
    data() {
      return {
        form: {
          title: '',
          content: '',
          circleId: null,
          bookId: null
        },
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 5, max: 100, message: '长度在5到100个字符', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { min: 10, message: '内容至少10个字符', trigger: 'blur' }
          ]
        },
        loading: false
      }
    },
    created() {
      this.form.circleId = this.$route.query.circleId
      this.form.bookId = this.$route.query.bookId
    },
    methods: {
      ...mapActions('posts', ['createPost']),
      async handleSubmit() {
        try {
          this.loading = true
          await this.$refs.postForm.validate()
          const newPost = await this.createPost(this.form)
          this.$message.success('发布成功！')
          
          // 根据来源跳转不同页面
          if (this.form.bookId) {
            this.$router.push(`/books/${this.form.bookId}`)
          } else if (this.form.circleId) {
            this.$router.push(`/my-circle`)
          } else {
            this.$router.push('/')
          }
        } catch (error) {
          this.$message.error(error.message)
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .create-post-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  </style>