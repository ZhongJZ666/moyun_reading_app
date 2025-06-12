<template>
    <div class="login-container">
      <el-card class="login-card">
        <h2>墨韵读书会登录</h2>
        <el-form 
          :model="form" 
          :rules="rules" 
          ref="loginForm"
          @submit.native.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              native-type="submit"
              :loading="loading"
              class="login-btn"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="footer">
          <router-link to="/register">注册账号</router-link>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  
  export default {
    name: 'LoginView',
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        loading: false
      }
    },
    methods: {
      ...mapActions('auth', ['login']),
      async handleLogin() {
        try {
          this.loading = true
          await this.$refs.loginForm.validate()
          const user = await this.login(this.form)
          console.log('登录成功，用户信息:', user)
          
          // 根据用户角色决定跳转路径
          let redirectPath = '/'
          if (user.role === 'admin') {
            redirectPath = '/admin'
          } else if (user.role === 'mentor') {
            redirectPath = '/mentor'
          } else if (user.role === 'student') {
            redirectPath = '/student'
          }
          
          console.log('准备跳转到:', redirectPath)
          await this.$router.push(redirectPath)
          this.$message.success('登录成功')
        } catch (error) {
          console.error('登录失败:', error)
          this.$message.error(error.message || '登录失败')
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f5f7fa;
  }
  
  .login-card {
    width: 400px;
    padding: 20px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }
  
  .login-btn {
    width: 100%;
  }
  
  .footer {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }
  </style>