<template>
  <div class="post-category">
    <div class="category-header">
      <h3>分类</h3>
      <el-button
        v-if="isAdmin"
        type="primary"
        size="small"
        @click="showAddDialog = true"
      >
        添加分类
      </el-button>
    </div>

    <div class="category-list">
      <el-menu
        :default-active="activeCategory"
        class="category-menu"
        @select="handleSelect"
      >
        <el-menu-item index="all">
          <el-icon><Document /></el-icon>
          <span>全部</span>
          <el-tag size="small" class="category-count">{{ totalCount }}</el-tag>
        </el-menu-item>
        <el-menu-item
          v-for="category in categories"
          :key="category.id"
          :index="category.id"
        >
          <el-icon><component :is="category.icon || 'Folder'" /></el-icon>
          <span>{{ category.name }}</span>
          <el-tag size="small" class="category-count">{{ category.count }}</el-tag>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 添加分类对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加分类"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="categoryForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select v-model="categoryForm.icon" placeholder="请选择图标">
            <el-option
              v-for="icon in iconOptions"
              :key="icon"
              :label="icon"
              :value="icon"
            >
              <el-icon><component :is="icon" /></el-icon>
              <span style="margin-left: 8px">{{ icon }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="handleAddCategory">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  Document,
  Folder,
  Collection,
  Reading,
  ChatDotRound,
  Star,
  Share
} from '@element-plus/icons-vue'

export default {
  name: 'PostCategory',
  components: {
    Document,
    Folder,
    Collection,
    Reading,
    ChatDotRound,
    Star,
    Share
  },
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    totalCount: {
      type: Number,
      default: 0
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeCategory: 'all',
      showAddDialog: false,
      categoryForm: {
        name: '',
        icon: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请选择图标', trigger: 'change' }
        ],
        description: [
          { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
        ]
      },
      iconOptions: [
        'Collection',
        'Reading',
        'ChatDotRound',
        'Star',
        'Share'
      ]
    }
  },
  methods: {
    handleSelect(index) {
      this.activeCategory = index
      this.$emit('select', index)
    },
    async handleAddCategory() {
      if (!this.$refs.formRef) return

      try {
        await this.$refs.formRef.validate()
        this.$emit('add', this.categoryForm)
        this.showAddDialog = false
        this.categoryForm = {
          name: '',
          icon: '',
          description: ''
        }
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.post-category {
  background-color: var(--background-color-light);
  border-radius: 4px;
  padding: 20px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.category-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.category-menu {
  border-right: none;
}

.category-count {
  margin-left: auto;
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-9);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 