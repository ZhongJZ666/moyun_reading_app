<template>
    <div class="circle-sidebar">
      <h3 class="title">{{ circle?.name || '未命名圈子' }}</h3>
      <p class="desc">{{ circle?.description || '暂无描述' }}</p>
      
      <div class="member-list">
        <h4>成员列表 ({{ members.length }})</h4>
        <div v-for="member in members" :key="member.id" class="member">
          <el-avatar :size="32" :src="member.avatar" />
          <span>{{ member.username }}</span>
        </div>
      </div>
  
      <div class="actions">
        <el-button 
          v-if="isMentor" 
          type="primary" 
          size="small"
          @click="showAddMemberDialog"
        >
          添加成员
        </el-button>
        <el-button type="text" @click="goToBookRecommend">推荐书籍</el-button>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters } from 'vuex';
  
  export default {
    name: 'CircleSidebar',
    props: {
      circle: {
        type: Object,
        required: true
      },
      members: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      ...mapState('auth', ['user']),
      ...mapGetters('auth', ['isMentor'])
    },
    methods: {
      showAddMemberDialog() {
        this.$emit('add-member');
      },
      goToBookRecommend() {
        this.$router.push('/recommend');
      }
    }
  };
  </script>
  
  <style scoped>
  .circle-sidebar {
    width: 250px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 4px;
  }
  
  .title {
    margin: 0 0 10px;
    font-size: 18px;
  }
  
  .desc {
    margin: 0 0 20px;
    color: #666;
    font-size: 14px;
  }
  
  .member-list {
    margin: 20px 0;
  }
  
  .member {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
  
  .member span {
    margin-left: 10px;
  }
  
  .actions {
    margin-top: 20px;
    text-align: center;
  }
  </style>