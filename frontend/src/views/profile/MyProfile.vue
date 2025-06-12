<template>
    <div class="profile-container">
      <h2>个人资料</h2>
      <el-divider />
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="profileForm"
        label-width="100px"
        @submit.native.prevent="handleSubmit"
      >
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        
        <el-form-item label="角色">
          <el-tag :type="roleTagType">
            {{ roleText }}
          </el-tag>
        </el-form-item>
        
        <el-form-item 
          label="导师" 
          v-if="form.role === 'student' && form.mentor"
        >
          <el-tag>{{ form.mentor.username }}</el-tag>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            native-type="submit"
            :loading="loading"
          >
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex'
  
  export default {
    name: 'MyProfileView',
    data() {
      return {
        form: {
          username: '',
          email: '',
          role: '',
          mentor: null
        },
        rules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
          ]
        },
        loading: false
      }
    },
    computed: {
      ...mapState('auth', ['user']),
      roleText() {
        const roles = {
          student: '学生',
          mentor: '导师',
          admin: '管理员'
        }
        return roles[this.form.role] || this.form.role
      },
      roleTagType() {
        const types = {
          student: 'success',
          mentor: 'warning',
          admin: 'danger'
        }
        return types[this.form.role] || ''
      }
    },
    created() {
      this.initForm()
    },
    methods: {
      ...mapActions('auth', ['updateProfile']),
      initForm() {
        this.form = {
          username: this.user.username,
          email: this.user.email,
          role: this.user.role,
          mentor: this.user.mentor
        }
      },
      async handleSubmit() {
        try {
          this.loading = true
          await this.$refs.profileForm.validate()
          await this.updateProfile({
            email: this.form.email
          })
          this.$message.success('资料更新成功！')
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
  .profile-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
  }
  </style>