<template>
    <div class="register-container">
      <el-card class="register-card">
        <h2>注册新账号</h2>
        <el-form 
          :model="form" 
          :rules="rules" 
          ref="registerForm"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="用户名"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              placeholder="邮箱"
              prefix-icon="el-icon-message"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码（至少6位）"
              prefix-icon="el-icon-lock"
              show-password
            />
          </el-form-item>
          <el-form-item prop="role">
            <el-select 
              v-model="form.role" 
              placeholder="选择角色"
              style="width: 100%"
            >
              <el-option label="学生" value="student" />
              <el-option label="导师" value="mentor" />
            </el-select>
          </el-form-item>
          <el-form-item 
            prop="mentorId"
            v-if="form.role === 'student'"
          >
            <el-select
              v-model="form.mentorId"
              placeholder="选择导师"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="mentor in mentors"
                :key="mentor.id"
                :label="mentor.username"
                :value="mentor.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              native-type="submit"
              :loading="loading"
              class="register-btn"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        <div class="footer">
          <router-link to="/login">已有账号？立即登录</router-link>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  
  export default {
    name: 'RegisterView',
    data() {
      return {
        form: {
          username: '',
          email: '',
          password: '',
          role: '',
          mentorId: null
        },
        mentors: [],
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在3到20个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度至少6位', trigger: 'blur' }
          ],
          role: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          mentorId: [
            { required: true, message: '请选择导师', trigger: 'change' }
          ]
        },
        loading: false
      }
    },
    async created() {
      await this.loadMentors()
    },
    methods: {
      ...mapActions('auth', ['register']),
      async loadMentors() {
        try {
          const response = await this.$api.users.getAllMentors()
          this.mentors = response.data
        } catch (error) {
          this.$message.error('加载导师列表失败')
        }
      },
      async handleRegister() {
        try {
          this.loading = true
          await this.$refs.registerForm.validate()
          await this.register(this.form)
          this.$message.success('注册成功！')
          this.$router.push('/login')
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
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f5f7fa;
  }
  
  .register-card {
    width: 450px;
    padding: 20px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }
  
  .register-btn {
    width: 100%;
  }
  
  .footer {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }
  </style>