<template>
  <div class="post-edit">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
          maxlength="2000"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="图片">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :limit="9"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="标签">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择或创建标签"
        >
          <el-option
            v-for="tag in tagOptions"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="submitting">
          发布
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'PostEdit',
  components: {
    Plus
  },
  props: {
    post: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      form: {
        title: '',
        content: '',
        tags: []
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 10, max: 2000, message: '内容长度在 10 到 2000 个字符', trigger: 'blur' }
        ]
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      submitting: false,
      tagOptions: ['读书笔记', '书评', '读后感', '推荐', '讨论']
    }
  },
  created() {
    if (this.post) {
      this.form = {
        title: this.post.title,
        content: this.post.content,
        tags: this.post.tags || []
      }
      if (this.post.images) {
        this.fileList = this.post.images.map((url, index) => ({
          name: `图片${index + 1}`,
          url
        }))
      }
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      if (index !== -1) {
        this.fileList.splice(index, 1)
      }
    },
    handleChange(file) {
      // 这里可以添加文件类型和大小的验证
      const isImage = file.raw.type.startsWith('image/')
      const isLt2M = file.raw.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传图片文件！')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB！')
        return false
      }
    },
    async handleSubmit() {
      if (!this.$refs.formRef) return

      try {
        await this.$refs.formRef.validate()
        this.submitting = true

        const formData = new FormData()
        formData.append('title', this.form.title)
        formData.append('content', this.form.content)
        formData.append('tags', JSON.stringify(this.form.tags))

        this.fileList.forEach((file, index) => {
          if (file.raw) {
            formData.append(`image${index}`, file.raw)
          }
        })

        this.$emit('submit', formData)
      } catch (error) {
        console.error('表单验证失败:', error)
      } finally {
        this.submitting = false
      }
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.post-edit {
  padding: 20px;
}

:deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
  line-height: 120px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 120px;
  height: 120px;
}

.el-form-item:last-child {
  margin-bottom: 0;
}
</style> 