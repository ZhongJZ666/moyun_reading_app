<template>
  <div class="post-share">
    <el-dialog
      v-model="dialogVisible"
      title="分享"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="share-content">
        <div class="share-preview">
          <div class="preview-header">
            <el-image
              v-if="post.images && post.images.length"
              :src="post.images[0]"
              fit="cover"
              class="preview-image"
            >
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="preview-info">
              <h4>{{ post.title }}</h4>
              <p>{{ post.content }}</p>
            </div>
          </div>
          <div class="preview-footer">
            <span>来自：{{ post.user.username }}</span>
          </div>
        </div>

        <div class="share-options">
          <div class="option-group">
            <h4>分享到</h4>
            <div class="share-buttons">
              <el-button
                v-for="platform in sharePlatforms"
                :key="platform.name"
                :icon="platform.icon"
                circle
                @click="handleShare(platform.type)"
              >
                <el-icon><component :is="platform.icon" /></el-icon>
              </el-button>
            </div>
          </div>

          <div class="option-group">
            <h4>复制链接</h4>
            <div class="copy-link">
              <el-input
                v-model="shareUrl"
                readonly
                :suffix-icon="Copy"
                @click="copyLink"
              />
            </div>
          </div>

          <div class="option-group">
            <h4>生成海报</h4>
            <el-button
              type="primary"
              :icon="Picture"
              @click="generatePoster"
            >
              生成分享海报
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 海报预览对话框 -->
    <el-dialog
      v-model="posterVisible"
      title="分享海报"
      width="300px"
      align-center
    >
      <div class="poster-preview">
        <img :src="posterUrl" alt="分享海报" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="posterVisible = false">取消</el-button>
          <el-button type="primary" @click="downloadPoster">
            保存图片
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  Picture,
  Share,
  ChatDotRound,
  Link,
  Copy,
  Wechat,
  Weibo,
  Qq
} from '@element-plus/icons-vue'

export default {
  name: 'PostShare',
  components: {
    Picture,
    Share,
    ChatDotRound,
    Link,
    Copy,
    Wechat,
    Weibo,
    Qq
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      posterVisible: false,
      posterUrl: '',
      shareUrl: '',
      sharePlatforms: [
        { name: '微信', type: 'wechat', icon: 'Wechat' },
        { name: '微博', type: 'weibo', icon: 'Weibo' },
        { name: 'QQ', type: 'qq', icon: 'Qq' },
        { name: '复制链接', type: 'link', icon: 'Link' }
      ]
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false)
      }
    }
  },
  created() {
    this.shareUrl = `${window.location.origin}/post/${this.post.id}`
  },
  methods: {
    handleShare(type) {
      switch (type) {
        case 'wechat':
          this.shareToWechat()
          break
        case 'weibo':
          this.shareToWeibo()
          break
        case 'qq':
          this.shareToQQ()
          break
        case 'link':
          this.copyLink()
          break
      }
    },
    shareToWechat() {
      // 实现微信分享逻辑
      this.$emit('share', { type: 'wechat', post: this.post })
    },
    shareToWeibo() {
      const url = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(this.shareUrl)}&title=${encodeURIComponent(this.post.title)}`
      window.open(url, '_blank')
    },
    shareToQQ() {
      const url = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(this.shareUrl)}&title=${encodeURIComponent(this.post.title)}&summary=${encodeURIComponent(this.post.content)}`
      window.open(url, '_blank')
    },
    async copyLink() {
      try {
        await navigator.clipboard.writeText(this.shareUrl)
        this.$message.success('链接已复制到剪贴板')
      } catch (err) {
        this.$message.error('复制失败，请手动复制')
      }
    },
    async generatePoster() {
      try {
        // 这里应该调用后端API生成海报
        const response = await this.$emit('generate-poster', this.post)
        this.posterUrl = response.url
        this.posterVisible = true
      } catch (error) {
        this.$message.error('生成海报失败')
      }
    },
    async downloadPoster() {
      try {
        const link = document.createElement('a')
        link.href = this.posterUrl
        link.download = `post-${this.post.id}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.$message.success('海报已保存')
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style scoped>
.post-share {
  .share-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .share-preview {
    background-color: var(--background-color-light);
    border-radius: 8px;
    padding: 15px;
  }

  .preview-header {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
  }

  .preview-image {
    width: 80px;
    height: 80px;
    border-radius: 4px;
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
    border-radius: 4px;
  }

  .preview-info {
    flex: 1;
    overflow: hidden;
  }

  .preview-info h4 {
    margin: 0 0 5px;
    font-size: 16px;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .preview-info p {
    margin: 0;
    font-size: 14px;
    color: var(--text-color-secondary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .preview-footer {
    font-size: 12px;
    color: var(--text-color-secondary);
  }

  .option-group {
    margin-bottom: 20px;

    h4 {
      margin: 0 0 10px;
      font-size: 14px;
      color: var(--text-color);
    }
  }

  .share-buttons {
    display: flex;
    gap: 10px;
  }

  .copy-link {
    display: flex;
    gap: 10px;
  }

  .poster-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;

    img {
      max-width: 100%;
      border-radius: 4px;
    }
  }
}
</style> 