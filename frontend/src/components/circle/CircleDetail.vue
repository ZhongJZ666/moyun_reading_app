<template>
  <div class="circle-detail">
    <!-- 圈子头部信息 -->
    <div class="circle-header">
      <div class="header-content">
        <el-image
          :src="circle.cover"
          fit="cover"
          class="circle-cover"
        >
          <template #error>
            <div class="image-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
        <div class="circle-info">
          <h1>{{ circle.name }}</h1>
          <p class="description">{{ circle.description }}</p>
          <div class="stats">
            <span>
              <el-icon><User /></el-icon>
              {{ circle.memberCount }} 成员
            </span>
            <span>
              <el-icon><Document /></el-icon>
              {{ circle.postCount }} 帖子
            </span>
          </div>
          <div class="actions">
            <el-button
              v-if="!isMember"
              type="primary"
              @click="handleJoin"
            >
              加入圈子
            </el-button>
            <el-button
              v-else
              type="danger"
              @click="handleLeave"
            >
              退出圈子
            </el-button>
            <el-button
              v-if="isAdmin"
              type="primary"
              @click="handleEdit"
            >
              编辑圈子
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 圈子内容区 -->
    <div class="circle-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="帖子" name="posts">
          <div class="post-actions" v-if="isMember">
            <el-button type="primary" @click="showCreatePostDialog = true">
              发表日志
            </el-button>
          </div>
          <div class="post-list">
            <el-card v-for="post in posts" :key="post.id" class="post-item">
              <div class="post-header">
                <div class="author-info">
                  <el-avatar :size="40" :src="post.author.avatar">
                    {{ post.author.username.charAt(0) }}
                  </el-avatar>
                  <div class="author-detail">
                    <span class="username">{{ post.author.username }}</span>
                    <span class="time">{{ formatTime(post.created_at) }}</span>
                  </div>
                </div>
              </div>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-content">{{ post.content }}</p>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="成员" name="members">
          <member-list
            :members="members"
            :loading="loading"
            @load-more="loadMoreMembers"
          />
        </el-tab-pane>
        <el-tab-pane label="公告" name="announcements">
          <div class="announcements">
            <div
              v-for="announcement in announcements"
              :key="announcement.id"
              class="announcement-item"
            >
              <h3>{{ announcement.title }}</h3>
              <p>{{ announcement.content }}</p>
              <span class="time">{{ announcement.createTime }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 编辑圈子对话框 -->
    <circle-edit-dialog
      v-if="showEditDialog"
      v-model="showEditDialog"
      :circle="circle"
      @success="handleEditSuccess"
    />

    <!-- 创建日志对话框 -->
    <el-dialog
      title="发表日志"
      v-model="showCreatePostDialog"
      width="600px"
    >
      <el-form :model="postForm" :rules="postRules" ref="postFormRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="postForm.title" placeholder="请输入日志标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            v-model="postForm.content"
            :rows="6"
            placeholder="请输入日志内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreatePostDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreatePost" :loading="creatingPost">
          发表
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Picture, User, Document } from '@element-plus/icons-vue'
import PostList from '../post/PostList.vue'
import MemberList from './MemberList.vue'
import CircleEditDialog from './CircleEditDialog.vue'
import { formatTime } from '@/utils/time'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CircleDetail',
  components: {
    Picture,
    User,
    Document,
    PostList,
    MemberList,
    CircleEditDialog
  },
  props: {
    circleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      circle: {
        id: '',
        name: '',
        description: '',
        cover: '',
        memberCount: 0,
        postCount: 0
      },
      posts: [],
      members: [],
      announcements: [],
      activeTab: 'posts',
      loading: false,
      showEditDialog: false,
      showCreatePostDialog: false,
      isMember: false,
      isAdmin: false,
      creatingPost: false,
      postForm: {
        title: '',
        content: ''
      },
      postRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 10, message: '内容至少 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchCircleDetail()
    this.fetchCirclePosts()
    this.fetchCircleMembers()
  },
  methods: {
    formatTime,
    ...mapActions('circles', ['fetchCircleDetail', 'fetchCircleMembers']),
    ...mapActions('posts', ['fetchCirclePosts', 'createPost']),
    
    async fetchCircleDetail() {
      this.loading = true
      try {
        const response = await this.$http.get(`/api/circles/${this.circleId}`)
        this.circle = response.data
        this.isMember = response.data.isMember
        this.isAdmin = response.data.isAdmin
      } catch (error) {
        this.$message.error('获取圈子详情失败')
      } finally {
        this.loading = false
      }
    },
    
    async fetchCirclePosts() {
      try {
        const posts = await this.$store.dispatch('posts/fetchCirclePosts', this.circleId)
        this.posts = posts
      } catch (error) {
        this.$message.error('获取圈子日志失败')
      }
    },
    
    async fetchCircleMembers() {
      try {
        const members = await this.$store.dispatch('circles/fetchCircleMembers', this.circleId)
        this.members = members
      } catch (error) {
        this.$message.error('获取圈子成员失败')
      }
    },
    
    async handleCreatePost() {
      try {
        await this.$refs.postFormRef.validate()
        this.creatingPost = true
        await this.$store.dispatch('posts/createPost', {
          ...this.postForm,
          circleId: this.circleId
        })
        this.$message.success('发表成功')
        this.showCreatePostDialog = false
        this.postForm = { title: '', content: '' }
        await this.fetchCirclePosts()
      } catch (error) {
        this.$message.error(error.message || '发表失败')
      } finally {
        this.creatingPost = false
      }
    },
    
    async handleJoin() {
      try {
        await this.$http.post(`/api/circles/${this.circleId}/join`)
        this.isMember = true
        this.circle.memberCount++
        this.$message.success('成功加入圈子')
      } catch (error) {
        this.$message.error('加入圈子失败')
      }
    },
    
    async handleLeave() {
      try {
        await this.$confirm('确定要退出该圈子吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$http.post(`/api/circles/${this.circleId}/leave`)
        this.isMember = false
        this.circle.memberCount--
        this.$message.success('已退出圈子')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('退出圈子失败')
        }
      }
    },
    
    handleEdit() {
      this.showEditDialog = true
    },
    
    handleEditSuccess() {
      this.fetchCircleDetail()
      this.$message.success('圈子信息更新成功')
    },
    
    async loadMoreMembers() {
      // 实现加载更多成员的逻辑
    }
  }
}
</script>

<style scoped>
.circle-detail {
  .circle-header {
    background-color: var(--background-color-light);
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .header-content {
    display: flex;
    gap: 20px;
  }

  .circle-cover {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--background-color);
    color: var(--text-color-secondary);
    border-radius: 8px;
  }

  .circle-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .circle-info h1 {
    margin: 0;
    font-size: 24px;
    color: var(--text-color);
  }

  .description {
    color: var(--text-color-secondary);
    margin: 0;
  }

  .stats {
    display: flex;
    gap: 20px;
    color: var(--text-color-secondary);

    span {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }

  .actions {
    margin-top: auto;
    display: flex;
    gap: 10px;
  }

  .circle-content {
    background-color: var(--background-color-light);
    padding: 20px;
    border-radius: 8px;
  }

  .post-actions {
    margin-bottom: 20px;
  }

  .post-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .post-item {
    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .author-detail {
      display: flex;
      flex-direction: column;
    }

    .username {
      font-weight: bold;
      color: var(--text-color);
    }

    .time {
      font-size: 12px;
      color: var(--text-color-secondary);
    }

    .post-title {
      margin: 0 0 10px;
      font-size: 18px;
      color: var(--text-color);
    }

    .post-content {
      margin: 0;
      color: var(--text-color-secondary);
      line-height: 1.6;
    }
  }

  .announcements {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .announcement-item {
    padding: 15px;
    background-color: var(--background-color);
    border-radius: 8px;

    h3 {
      margin: 0 0 10px;
      font-size: 16px;
      color: var(--text-color);
    }

    p {
      margin: 0 0 10px;
      color: var(--text-color-secondary);
    }

    .time {
      font-size: 12px;
      color: var(--text-color-secondary);
    }
  }
}
</style> 