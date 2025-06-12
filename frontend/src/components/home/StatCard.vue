<template>
    <el-card class="stat-card" :style="{ borderTop: `4px solid ${color}` }">
      <div class="stat-content">
        <div class="stat-icon" :style="{ color }">
          <el-icon :size="30">
            <component :is="icon" />
          </el-icon>
        </div>
        <div class="stat-text">
          <div class="stat-title">{{ title }}</div>
          <div class="stat-value">{{ value }}</div>
        </div>
      </div>
    </el-card>
  </template>
  
  <script>
  export default {
    name: 'StatCard',
    props: {
      title: String,
      value: [String, Number],
      icon: String,
      color: {
        type: String,
        default: '#409EFF'
      }
    }
  }
  </script>
  
  <style scoped>
  .stat-card {
    margin-bottom: 20px;
  }
  
  .stat-content {
    display: flex;
    align-items: center;
  }
  
  .stat-icon {
    margin-right: 15px;
  }
  
  .stat-text {
    flex: 1;
  }
  
  .stat-title {
    color: #999;
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
  }
  </style>