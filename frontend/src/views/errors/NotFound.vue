<template>
    <div class="not-found-container">
      <el-result
        icon="error"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">
            返回首页
          </el-button>
        </template>
      </el-result>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundView'
  }
  </script>
  
  <style scoped>
  .not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
  </style>