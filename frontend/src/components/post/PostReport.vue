<template>
  <div class="post-report">
    <el-dialog
      v-model="dialogVisible"
      title="举报"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="举报类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择举报类型">
            <el-option
              v-for="type in reportTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="详细说明" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述举报原因，以便我们更好地处理"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="图片证据">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :limit="3"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="previewVisible">
            <img w-full :src="previewUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            提交举报
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'PostReport',
  components: {
    Plus
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    postId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      previewVisible: false,
      previewUrl: '',
      submitting: false,
      fileList: [],
      form: {
        type: '',
        description: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择举报类型', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请填写详细说明', trigger: 'blur' },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ]
      },
      reportTypes: [
        { label: '垃圾广告', value: 'spam' },
        { label: '色情低俗', value: 'porn' },
        { label: '违法违规', value: 'illegal' },
        { label: '人身攻击', value: 'attack' },
        { label: '侵犯权益', value: 'rights' },
        { label: '其他', value: 'other' }
      ]
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false)
        this.resetForm()
      }
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.previewUrl = file.url
      this.previewVisible = true
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      if (index !== -1) {
        this.fileList.splice(index, 1)
      }
    },
    handleChange(file) {
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
        formData.append('postId', this.postId)
        formData.append('type', this.form.type)
        formData.append('description', this.form.description)

        this.fileList.forEach((file, index) => {
          if (file.raw) {
            formData.append(`image${index}`, file.raw)
          }
        })

        await this.$emit('submit', formData)
        this.$message.success('举报已提交，我们会尽快处理')
        this.dialogVisible = false
      } catch (error) {
        console.error('表单验证失败:', error)
      } finally {
        this.submitting = false
      }
    },
    handleCancel() {
      this.dialogVisible = false
    },
    resetForm() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields()
      }
      this.fileList = []
      this.form = {
        type: '',
        description: ''
      }
    }
  }
}
</script>

<style scoped>
.post-report {
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }

  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 100px;
    height: 100px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style> 