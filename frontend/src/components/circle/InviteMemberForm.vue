<template>
  <el-dialog
    v-model="dialogVisible"
    title="邀请成员"
    width="500px"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入要邀请的用户名" />
      </el-form-item>
      <el-form-item label="邀请消息" prop="message">
        <el-input
          v-model="form.message"
          type="textarea"
          :rows="3"
          placeholder="请输入邀请消息"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">发送邀请</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'InviteMemberForm',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        username: '',
        message: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        message: [
          { required: true, message: '请输入邀请消息', trigger: 'blur' },
          { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$refs.formRef?.resetFields()
    },
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 