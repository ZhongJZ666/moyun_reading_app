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
          <post-list
            :posts="posts"
            :loading="loading"
            @load-more="loadMorePosts"
          />
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
  </div>
</template>

<script>
import { Picture, User, Document } from '@element-plus/icons-vue'
import PostList from '../post/PostList.vue'
import MemberList from './MemberList.vue'
import CircleEditDialog from './CircleEditDialog.vue'

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
      isMember: false,
      isAdmin: false
    }
  },
  created() {
    this.fetchCircleDetail()
  },
  methods: {
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
    async loadMorePosts() {
      // 实现加载更多帖子的逻辑
    },
    async loadMoreMembers() {
      // 实现加载更多成员的逻辑
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