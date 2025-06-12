<template>
  <div class="post-list">
    <div class="list-header">
      <div class="header-left">
        <h2>{{ title }}</h2>
        <el-tag v-if="total" size="small">{{ total }}篇</el-tag>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchQuery"
          placeholder="搜索帖子..."
          @input="handleSearch"
        />
        <el-select
          v-model="sortBy"
          placeholder="排序方式"
          @change="handleSort"
        >
          <el-option label="最新" value="latest" />
          <el-option label="最热" value="hottest" />
        </el-select>
      </div>
    </div>
    <div class="posts-container">
      <el-card
        v-for="post in posts"
        :key="post.id"
        class="post-card"
        :body-style="{ padding: '20px' }"
        @click="handlePostClick(post)"
      >
        <div class="post-header">
          <div class="user-info">
            <el-avatar :size="40" :src="post.user?.avatar" :alt="post.user?.username || post.author_name">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="user-details">
              <span class="username">{{ post.user?.username || post.author_name || '未知用户' }}</span>
              <span class="post-time">{{ post.createTime || post.created_at }}</span>
            </div>
          </div>
          <el-dropdown v-if="isAuthor(post.user?.id || post.author_id)">
            <el-button type="text" title="更多操作">
              <el-icon><More /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.stop="handleEdit(post)">编辑</el-dropdown-item>
                <el-dropdown-item @click.stop="handleDelete(post)" class="danger">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="post-content">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-text">{{ post.content }}</p>
          <div v-if="post.images && post.images.length" class="post-images">
            <el-image
              v-for="(image, index) in post.images.slice(0, 3)"
              :key="index"
              :src="image"
              :preview-src-list="post.images"
              fit="cover"
              class="post-image"
              :alt="`帖子图片 ${index + 1}`"
            />
            <div v-if="post.images.length > 3" class="image-more">
              +{{ post.images.length - 3 }}
            </div>
          </div>
        </div>
        <div class="post-footer">
          <div class="post-actions">
            <el-button type="text" @click.stop="handleLike(post)">
              <el-icon><Star /></el-icon>
              <span>{{ post.likeCount }}</span>
            </el-button>
            <el-button type="text" @click.stop="handleComment(post)">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ post.commentCount }}</span>
            </el-button>
            <el-button type="text" @click.stop="handleShare(post)">
              <el-icon><Share /></el-icon>
              <span>分享</span>
            </el-button>
          </div>
          <div class="post-tags" v-if="post.tags && post.tags.length">
            <el-tag
              v-for="tag in post.tags"
              :key="tag"
              size="small"
              class="post-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>
    <div class="list-footer" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { User, More, Star, ChatDotRound, Share } from '@element-plus/icons-vue'

export default {
  name: 'PostList',
  components: {
    User,
    More,
    Star,
    ChatDotRound,
    Share
  },
  props: {
    title: {
      type: String,
      default: '帖子列表'
    },
    posts: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      searchQuery: '',
      sortBy: 'latest',
      currentPage: 1,
      pageSize: 10
    }
  },
  watch: {
    sortBy(val) {
      this.$emit('sort-change', val)
    }
  },
  methods: {
    isAuthor(userId) {
      // 这里需要根据实际用户ID判断
      return userId === 'current-user-id'
    },
    handlePostClick(post) {
      this.$emit('post-click', post)
    },
    handleEdit(post) {
      this.$emit('edit', post)
    },
    handleDelete(post) {
      this.$confirm('确定要删除这篇帖子吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', post)
      })
    },
    handleLike(post) {
      this.$emit('like', post)
    },
    handleComment(post) {
      this.$emit('comment', post)
    },
    handleShare(post) {
      this.$emit('share', post)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.$emit('page-change', {
        page: this.currentPage,
        size: val
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('page-change', {
        page: val,
        size: this.pageSize
      })
    },
    handleSearch(value) {
      this.$emit('search', value)
    },
    handleSort(value) {
      this.$emit('sort', value)
    }
  }
}
</script>

<style scoped>
.post-list {
  margin-bottom: 30px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  color: var(--text-color);
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.post-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.post-card:hover {
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  color: var(--text-color);
}

.post-time {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.post-content {
  margin-bottom: 15px;
}

.post-title {
  margin: 0 0 10px;
  font-size: 18px;
  color: var(--text-color);
}

.post-text {
  margin: 0 0 15px;
  color: var(--text-color);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  position: relative;
}

.post-image {
  width: 100%;
  height: 200px;
  border-radius: 4px;
  cursor: pointer;
}

.image-more {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 33.33%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  border-radius: 4px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
}

.post-actions {
  display: flex;
  gap: 20px;
}

.post-tags {
  display: flex;
  gap: 10px;
}

.list-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.danger {
  color: var(--danger-color);
}
</style> 