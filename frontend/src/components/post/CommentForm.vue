<template>
  <div class="comment-form">
    <el-input
      v-model="content"
      type="textarea"
      :rows="3"
      placeholder="写下你的评论..."
      :maxlength="500"
      show-word-limit
    />
    <div class="form-footer">
      <el-button type="primary" @click="handleSubmit" :disabled="!content.trim()">
        发表评论
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentForm',
  data() {
    return {
      content: ''
    }
  },
  methods: {
    handleSubmit() {
      if (this.content.trim()) {
        this.$emit('submit', this.content)
        this.content = ''
      }
    }
  }
}
</script>

<style scoped>
.comment-form {
  margin-bottom: 20px;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style> 