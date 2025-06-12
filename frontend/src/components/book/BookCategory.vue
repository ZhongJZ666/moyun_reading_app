<template>
  <div class="book-category">
    <div class="category-header">
      <h2>图书分类</h2>
      <el-button
        v-if="isAdmin"
        type="primary"
        @click="showAddDialog = true"
      >
        添加分类
      </el-button>
    </div>

    <!-- 分类列表 -->
    <el-menu
      :default-active="activeCategory"
      class="category-menu"
      @select="handleSelect"
    >
      <el-menu-item index="all">
        <el-icon><Collection /></el-icon>
        <span>全部</span>
        <span class="count">({{ totalCount }})</span>
      </el-menu-item>

      <el-menu-item
        v-for="category in categories"
        :key="category.id"
        :index="category.id"
      >
        <el-icon>
          <component :is="category.icon || 'Folder'" />
        </el-icon>
        <span>{{ category.name }}</span>
        <span class="count">({{ category.count }})</span>
      </el-menu-item>
    </el-menu>

    <!-- 添加分类对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加分类"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入分类名称"
          />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-select
            v-model="form.icon"
            placeholder="选择图标"
            clearable
          >
            <el-option
              v-for="icon in iconOptions"
              :key="icon.value"
              :label="icon.label"
              :value="icon.value"
            >
              <el-icon>
                <component :is="icon.value" />
              </el-icon>
              <span style="margin-left: 8px">{{ icon.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Collection, Folder } from '@element-plus/icons-vue'

export default {
  name: 'BookCategory',
  components: {
    Collection,
    Folder
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeCategory: 'all',
      categories: [],
      totalCount: 0,
      showAddDialog: false,
      submitting: false,
      form: {
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
          { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
        ]
      },
      iconOptions: [
        { label: '文学', value: 'Reading' },
        { label: '历史', value: 'Timer' },
        { label: '哲学', value: 'Light' },
        { label: '艺术', value: 'Brush' },
        { label: '科技', value: 'Monitor' },
        { label: '生活', value: 'House' }
      ]
    }
  },
  created() {
    this.fetchCategories()
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await this.$http.get('/api/book-categories')
        this.categories = response.data.categories
        this.totalCount = response.data.totalCount
      } catch (error) {
        this.$message.error('获取分类列表失败')
      }
    },
    handleSelect(index) {
      this.activeCategory = index
      this.$emit('select', index === 'all' ? null : index)
    },
    async handleSubmit() {
      if (!this.$refs.formRef) return

      try {
        await this.$refs.formRef.validate()
        this.submitting = true

        const response = await this.$http.post('/api/book-categories', this.form)
        this.categories.push(response.data)
        this.showAddDialog = false
        this.$message.success('分类添加成功')
        this.resetForm()
      } catch (error) {
        console.error('表单验证失败:', error)
      } finally {
        this.submitting = false
      }
    },
    resetForm() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields()
      }
      this.form = {
        name: '',
        icon: '',
        description: ''
      }
    }
  }
}
</script>

<style scoped>
.book-category {
  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 24px;
      color: var(--text-color);
    }
  }

  .category-menu {
    border-right: none;
  }

  .count {
    margin-left: 8px;
    font-size: 12px;
    color: var(--text-color-secondary);
  }

  :deep(.el-menu-item) {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  :deep(.el-select-dropdown__item) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style> 