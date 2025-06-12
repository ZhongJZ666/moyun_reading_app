<template>
    <el-card class="activity-feed">
      <template #header>
        <div class="card-header">
          <span>最近活动</span>
        </div>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="activity in activities"
          :key="activity.id"
          :timestamp="activity.time"
          placement="top"
        >
          <el-card shadow="hover">
            <div v-if="activity.type === 'post'">
              <p>{{ activity.author }} 发表了《{{ activity.title }}》</p>
            </div>
            <div v-else>
              <p>{{ activity.author }} {{ activity.content }}</p>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </template>
  
  <script>
  export default {
    name: 'ActivityFeed',
    props: {
      activities: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .activity-feed {
    margin-top: 20px;
  }
  </style>