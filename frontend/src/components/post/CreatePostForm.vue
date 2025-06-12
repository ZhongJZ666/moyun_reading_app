<template>
  <div class="create-post-form">
    <el-form :model="postForm" :rules="rules" ref="postForm" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="postForm.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      
      <el-form-item label="内容" prop="content">
        <el-input
          type="textarea"
          v-model="postForm.content"
          :rows="6"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>

      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="postForm.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择或创建标签"
        >
          <el-option
            v-for="tag in availableTags"
            :key="tag"
            :label="tag"
            :value="tag"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="submitting">发布</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CreatePostForm',
  props: {
    bookId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      postForm: {
        title: '',
        content: '',
        tags: [],
        bookId: null
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 10, message: '内容不能少于 10 个字符', trigger: 'blur' }
        ]
      },
      availableTags: ['读书笔记', '书评', '读后感', '推荐', '讨论', '问答'],
      submitting: false
    }
  },
  created() {
    // 设置书籍ID
    this.postForm.bookId = this.bookId
  },
  methods: {
    async submitForm() {
      if (!this.$refs.postForm) return

      try {
        await this.$refs.postForm.validate()
        this.submitting = true
        await this.$emit('submit', this.postForm)
        this.$message.success('发布成功')
        this.resetForm()
      } catch (error) {
        console.error('表单提交失败:', error)
        this.$message.error(error.message || '发布失败，请重试')
      } finally {
        this.submitting = false
      }
    },
    resetForm() {
      if (this.$refs.postForm) {
        this.$refs.postForm.resetFields()
        // 保持书籍ID不变
        this.postForm.bookId = this.bookId
      }
    }
  }
}
</script>

<style scoped>
.create-post-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style> 