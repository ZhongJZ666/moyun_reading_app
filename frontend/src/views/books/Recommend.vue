<template>
    <div class="recommend-container">
      <h2>推荐新书</h2>
      <el-divider />
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="recommendForm"
        label-width="100px"
        @submit.native.prevent="handleSubmit"
      >
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" />
        </el-form-item>
        <el-form-item label="封面图片" prop="cover_url">
          <el-upload
            class="upload-demo"
            action="http://localhost:3000/api/books/upload-cover"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            name="cover"
            :headers="uploadHeaders"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
          <div class="cover-preview" v-if="form.cover_url">
            <img :src="'/' + form.cover_url" alt="封面预览">
          </div>
        </el-form-item>
        <el-form-item label="内容简介" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="5" 
          />
        </el-form-item>
        <el-form-item label="主要内容" prop="content">
          <el-input 
            v-model="form.content" 
            type="textarea" 
            :rows="8" 
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            native-type="submit"
            :loading="loading"
          >
            提交推荐
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  
  export default {
    name: 'RecommendView',
    data() {
      return {
        form: {
          title: '',
          author: '',
          cover_url: '',
          description: '',
          content: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入书名', trigger: 'blur' }
          ],
          author: [
            { required: true, message: '请输入作者', trigger: 'blur' }
          ],
          cover_url: [
            { required: true, message: '请上传封面图片', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请输入主要内容', trigger: 'blur' }
          ]
        },
        loading: false,
        uploadHeaders: {
          Authorization: localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : ''
        }
      }
    },
    methods: {
      ...mapActions('books', ['recommendBook']),
      handleUploadSuccess(res) {
        if (res.cover_url) {
          this.form.cover_url = res.cover_url
          this.$message.success('图片上传成功')
        }
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        if (!isJPG) {
          this.$message.error('只能上传jpg/png文件!');
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('图片大小不能超过2MB!');
          return false;
        }
        return true;
      },
      async handleSubmit() {
        try {
          this.loading = true
          await this.$refs.recommendForm.validate()
          await this.recommendBook(this.form)
          this.$message.success('推荐成功！')
          this.$router.push('/books')
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
  .recommend-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .cover-preview {
    margin-top: 10px;
  }
  
  .cover-preview img {
    max-width: 200px;
    max-height: 300px;
    border: 1px solid #ddd;
  }
  </style>