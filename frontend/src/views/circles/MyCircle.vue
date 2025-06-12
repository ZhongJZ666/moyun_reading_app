<template>
    <div class="circle-container">
      <template v-if="circle && circle.id">
        <el-row :gutter="20">
          <el-col :span="6">
            <circle-sidebar 
              :circle="circle" 
              :members="members"
              @add-member="showAddMemberDialog = true"
            />
          </el-col>
          <el-col :span="18">
            <div class="post-area">
              <create-post-form 
                v-if="isMember"
                :circle-id="circle.id"
                @created="handlePostCreated"
              />
              
              <post-list 
                :posts="posts" 
                :loading="loading"
                @load-more="loadMorePosts"
              />
            </div>
          </el-col>
        </el-row>
    
        <el-dialog 
          title="添加成员" 
          v-model="showAddMemberDialog"
          width="30%"
        >
          <add-member-form 
            :circle-id="circle.id"
            @success="handleMemberAdded"
          />
        </el-dialog>
      </template>
      <template v-else>
        <div>
          <el-empty description="你还没有加入任何圈子" />
          <div v-if="allCircles && allCircles.length">
            <h3>所有圈子</h3>
            <el-row :gutter="20">
              <el-col :span="6" v-for="c in allCircles" :key="c.id">
                <el-card>
                  <div>{{ c.name }}</div>
                  <div>{{ c.description }}</div>
                  <el-button type="primary" size="mini" @click="joinCircle(c.id)">加入圈子</el-button>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import CircleSidebar from '@/components/CircleSidebar.vue'
  import CreatePostForm from '@/components/CreatePostForm.vue'
  import PostList from '@/components/PostList.vue'
  import AddMemberForm from '@/components/AddMemberForm.vue'
  
  export default {
    name: 'MyCircleView',
    components: {
      CircleSidebar,
      CreatePostForm,
      PostList,
      AddMemberForm
    },
    data() {
      return {
        showAddMemberDialog: false,
        page: 1,
        pageSize: 10
      }
    },
    computed: {
      ...mapState('circles', ['circle', 'members', 'loading', 'allCircles']),
      ...mapState('posts', ['posts']),
      ...mapGetters('auth', ['isMentor', 'currentUser']),
      isMember() {
        return this.members.some(m => m.id === this.currentUser.id)
      }
    },
    async created() {
      await this.fetchCircleData()
      await this.fetchAllCircles()
    },
    methods: {
      ...mapActions('circles', ['fetchMyCircle', 'fetchAllCircles']),
      ...mapActions('posts', ['fetchCirclePosts']),
      async fetchCircleData() {
        await this.fetchMyCircle()
        if (this.circle?.id) {
          await this.fetchCirclePosts({
            circleId: this.circle.id,
            page: this.page,
            pageSize: this.pageSize
          })
        }
      },
      handlePostCreated(newPost) {
        this.posts.unshift(newPost)
      },
      handleMemberAdded() {
        this.showAddMemberDialog = false
        this.fetchCircleData()
      },
      async loadMorePosts() {
        this.page++
        await this.fetchCirclePosts({
          circleId: this.circle.id,
          page: this.page,
          pageSize: this.pageSize
        })
      },
      async joinCircle(circleId) {
        this.$message.success('加入圈子功能请根据后端API实现！')
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
  </style>