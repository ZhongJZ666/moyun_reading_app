<template>
    <div class="circle-container">
      <template v-if="circles && circles.length">
        <h3>我加入的圈子</h3>
        <el-row :gutter="20">
          <el-col :span="6" v-for="c in circles" :key="c.id">
            <el-card>
              <div>{{ c.name }}</div>
              <div>{{ c.description }}</div>
            </el-card>
          </el-col>
        </el-row>
      </template>
      <h3 style="margin-top: 32px;">所有圈子</h3>
      <el-row :gutter="20">
        <el-col :span="6" v-for="c in allCircles" :key="c.id">
          <el-card :class="{ 'joined-circle': isJoined(c.id) }">
            <div>{{ c.name }}</div>
            <div>{{ c.description }}</div>
            <el-button 
              type="primary" 
              size="mini" 
              :disabled="isJoined(c.id)"
              @click="joinCircle(c.id)">
              {{ isJoined(c.id) ? '已加入' : '加入圈子' }}
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import circlesApi from '@/api/circles'
  
  export default {
    name: 'MyCircleView',
    data() {
      return {
        page: 1,
        pageSize: 10
      }
    },
    computed: {
      ...mapState('circles', ['circles', 'members', 'loading', 'allCircles']),
      ...mapGetters('auth', ['isMentor', 'currentUser'])
    },
    async created() {
      await this.fetchMyCircles()
      await this.fetchAllCircles()
    },
    methods: {
      ...mapActions('circles', ['fetchMyCircles', 'fetchAllCircles']),
      isJoined(circleId) {
        return this.circles.some(c => c.id === circleId)
      },
      async joinCircle(circleId) {
        try {
          await circlesApi.joinCircle(circleId)
          this.$message.success('加入圈子成功')
          await this.fetchMyCircles()
        } catch (e) {
          this.$message.error(e.message || '加入圈子失败')
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .circle-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .post-area {
    padding: 0 20px;
  }
  
  .joined-circle {
    border: 2px solid #67c23a;
    background: #f6ffed;
  }
  </style>