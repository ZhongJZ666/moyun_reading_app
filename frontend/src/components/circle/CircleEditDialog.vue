<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑圈子"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="圈子名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入圈子名称" />
      </el-form-item>

      <el-form-item label="圈子简介" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入圈子简介"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="封面图片">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :limit="1"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="previewVisible">
          <img w-full :src="previewUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="加入方式" prop="joinType">
        <el-radio-group v-model="form.joinType">
          <el-radio label="free">自由加入</el-radio>
          <el-radio label="approval">需要审核</el-radio>
          <el-radio label="invite">仅限邀请</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="标签">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择或输入标签"
        >
          <el-option
            v-for="tag in tagOptions"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
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
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'CircleEditDialog',
  components: {
    Plus
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Object,
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
        name: '',
        description: '',
        joinType: 'free',
        tags: []
      },
      rules: {
        name: [
          { required: true, message: '请输入圈子名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入圈子简介', trigger: 'blur' },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        joinType: [
          { required: true, message: '请选择加入方式', trigger: 'change' }
        ]
      },
      tagOptions: [
        '读书',
        '写作',
        '文学',
        '历史',
        '哲学',
        '艺术',
        '科技',
        '生活'
      ]
    }
  },
  watch: {
    modelValue(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:modelValue', false)
        this.resetForm()
      }
    },
    circle: {
      handler(val) {
        if (val) {
          this.initForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    initForm() {
      this.form = {
        name: this.circle.name,
        description: this.circle.description,
        joinType: this.circle.joinType,
        tags: this.circle.tags || []
      }
      if (this.circle.cover) {
        this.fileList = [{
          name: 'cover',
          url: this.circle.cover
        }]
      }
    },
    handlePictureCardPreview(file) {
      this.previewUrl = file.url
      this.previewVisible = true
    },
    handleRemove() {
      this.fileList = []
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
        formData.append('name', this.form.name)
        formData.append('description', this.form.description)
        formData.append('joinType', this.form.joinType)
        formData.append('tags', JSON.stringify(this.form.tags))

        if (this.fileList.length > 0 && this.fileList[0].raw) {
          formData.append('cover', this.fileList[0].raw)
        }

        await this.$http.put(`/api/circles/${this.circle.id}`, formData)
        this.$emit('success')
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
        name: '',
        description: '',
        joinType: 'free',
        tags: []
      }
    }
  }
}
</script>

<style scoped>
.circle-edit-dialog {
  :deep(.el-upload--picture-card) {
    width: 120px;
    height: 120px;
    line-height: 120px;
  }

  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 120px;
    height: 120px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style> 