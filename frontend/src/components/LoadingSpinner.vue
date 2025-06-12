<template>
    <div class="loading-spinner" v-if="visible">
      <div class="spinner"></div>
      <p class="text">{{ text || '加载中...' }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingSpinner',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      text: String
    }
  };
  </script>
  
  <style scoped>
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #409EFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .text {
    margin-top: 15px;
    color: #666;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>