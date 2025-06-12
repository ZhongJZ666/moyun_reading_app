<template>
    <div class="circle-detail-container">
      <el-page-header @back="$router.go(-1)" :content="circle.name" />
      <el-divider />
      
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="circle-info-card">
            <h3>圈子信息</h3>
            <p class="description">{{ circle.description || '暂无描述' }}</p>
            <div class="member-count">
              <el-icon><User /></el-icon>
              <span>{{ members.length }}名成员</span>
            </div>
            
            <div class="actions" v-if="isMentor">
              <el-button 
                type="primary" 
                size="small"
                @click="showInviteDialog = true"
              >
                邀请成员
              </el-button>
            </div>
          </div>
          
          <member-list :members="members" />
        </el-col>
        
        <el-col :span="18">
          <post-list 
            :posts="posts" 
            :loading="loadingPosts"
            @create-post="showCreatePostDialog = true"
          />
        </el-col>
      </el-row>
      
      <!-- 邀请成员对话框 -->
      <el-dialog 
        title="邀请新成员" 
        v-model="showInviteDialog"
        width="500px"
      >
        <invite-member-form 
          :circle-id="circle.id"
          @success="handleMemberInvited"
        />
      </el-dialog>
      
      <!-- 创建帖子对话框 -->
      <el-dialog 
        title="发表新帖子" 
        v-model="showCreatePostDialog"
        width="800px"
      >
        <create-post-form 
          :circle-id="circle.id"
          @success="handlePostCreated"
        />
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { User } from '@element-plus/icons-vue'
  import { mapState, mapActions } from 'vuex'
  import MemberList from '@/components/circle/MemberList.vue'
  import PostList from '@/components/post/PostList.vue'
  import InviteMemberForm from '@/components/circle/InviteMemberForm.vue'
  import CreatePostForm from '@/components/post/CreatePostForm.vue'
  
  export default {
    name: 'CircleDetailView',
    components: {
      User,
      MemberList,
      PostList,
      InviteMemberForm,
      CreatePostForm
    },
    data() {
      return {
        circleId: this.$route.params.id,
        showInviteDialog: false,
        showCreatePostDialog: false
      }
    },
    computed: {
      ...mapState('circles', ['circle', 'members', 'loading']),
      ...mapState('posts', ['posts', 'loadingPosts']),
      isMentor() {
        return this.$store.getters['auth/isMentor'] && 
               this.circle?.mentor_id === this.$store.state.auth.user.id
      }
    },
    async created() {
      await this.loadCircleData()
    },
    methods: {
      ...mapActions('circles', ['fetchCircleDetail', 'fetchCircleMembers']),
      ...mapActions('posts', ['fetchCirclePosts']),
      
      async loadCircleData() {
        await Promise.all([
          this.fetchCircleDetail(this.circleId),
          this.fetchCircleMembers(this.circleId),
          this.fetchCirclePosts({ circleId: this.circleId })
        ])
      },
      
      handleMemberInvited() {
        this.showInviteDialog = false
        this.fetchCircleMembers(this.circleId)
      },
      
      handlePostCreated(newPost) {
        this.showCreatePostDialog = false
        this.posts.unshift(newPost)
      }
    }
  }
  </script>
  
  <style scoped>
  .circle-detail-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .circle-info-card {
    padding: 20px;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  }
  
  .description {
    color: #666;
    margin: 15px 0;
  }
  
  .member-count {
    display: flex;
    align-items: center;
    color: #888;
    font-size: 14px;
  }
  
  .member-count .el-icon {
    margin-right: 5px;
  }
  
  .actions {
    margin-top: 20px;
  }
  </style>