<template>
  <div class="book-search">
    <div class="search-header">
      <h2>搜索图书</h2>
      <el-button
        type="primary"
        @click="showAdvanced = !showAdvanced"
      >
        {{ showAdvanced ? '收起' : '高级搜索' }}
        <el-icon class="el-icon--right">
          <component :is="showAdvanced ? 'ArrowUp' : 'ArrowDown'" />
        </el-icon>
      </el-button>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <el-input
        v-model="searchQuery"
        placeholder="输入书名、作者、ISBN等关键词"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <!-- 高级搜索 -->
    <el-collapse-transition>
      <div v-show="showAdvanced" class="advanced-search">
        <el-form
          ref="formRef"
          :model="advancedForm"
          label-width="80px"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="分类">
                <el-select
                  v-model="advancedForm.category"
                  placeholder="选择分类"
                  clearable
                >
                  <el-option
                    v-for="category in categories"
                    :key="category.value"
                    :label="category.label"
                    :value="category.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="作者">
                <el-input
                  v-model="advancedForm.author"
                  placeholder="输入作者名"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出版社">
                <el-input
                  v-model="advancedForm.publisher"
                  placeholder="输入出版社"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="出版年份">
                <el-date-picker
                  v-model="advancedForm.publishYear"
                  type="year"
                  placeholder="选择年份"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评分">
                <el-rate
                  v-model="advancedForm.minRating"
                  :max="5"
                  :texts="['1分', '2分', '3分', '4分', '5分']"
                  show-text
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标签">
                <el-select
                  v-model="advancedForm.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="选择或输入标签"
                >
                  <el-option
                    v-for="tag in tagOptions"
                    :key="tag"
                    :label="tag"
                    :value="tag"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button type="primary" @click="handleAdvancedSearch">
              搜索
            </el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <!-- 搜索历史 -->
    <div v-if="searchHistory.length" class="search-history">
      <div class="history-header">
        <h3>搜索历史</h3>
        <el-button
          type="text"
          @click="clearHistory"
        >
          清空历史
        </el-button>
      </div>
      <div class="history-list">
        <el-tag
          v-for="item in searchHistory"
          :key="item"
          class="history-item"
          @click="handleHistoryClick(item)"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div class="hot-search">
      <h3>热门搜索</h3>
      <div class="hot-list">
        <el-tag
          v-for="(item, index) in hotSearches"
          :key="item.keyword"
          :type="index < 3 ? 'danger' : ''"
          class="hot-item"
          @click="handleHotClick(item.keyword)"
        >
          {{ item.keyword }}
          <span class="hot-count">{{ item.count }}次搜索</span>
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

export default {
  name: 'BookSearch',
  components: {
    Search,
    ArrowUp,
    ArrowDown
  },
  data() {
    return {
      searchQuery: '',
      showAdvanced: false,
      advancedForm: {
        category: '',
        author: '',
        publisher: '',
        publishYear: null,
        minRating: 0,
        tags: []
      },
      categories: [
        { label: '文学', value: 'literature' },
        { label: '历史', value: 'history' },
        { label: '哲学', value: 'philosophy' },
        { label: '艺术', value: 'art' },
        { label: '科技', value: 'technology' },
        { label: '生活', value: 'life' }
      ],
      tagOptions: [
        '经典',
        '畅销',
        '获奖',
        '新书',
        '推荐',
        '必读'
      ],
      searchHistory: [],
      hotSearches: [
        { keyword: '三体', count: 1234 },
        { keyword: '活着', count: 987 },
        { keyword: '百年孤独', count: 876 },
        { keyword: '围城', count: 765 },
        { keyword: '平凡的世界', count: 654 }
      ]
    }
  },
  created() {
    this.loadSearchHistory()
  },
  methods: {
    loadSearchHistory() {
      const history = localStorage.getItem('bookSearchHistory')
      if (history) {
        this.searchHistory = JSON.parse(history)
      }
    },
    saveSearchHistory(keyword) {
      if (!keyword) return
      const index = this.searchHistory.indexOf(keyword)
      if (index !== -1) {
        this.searchHistory.splice(index, 1)
      }
      this.searchHistory.unshift(keyword)
      if (this.searchHistory.length > 10) {
        this.searchHistory.pop()
      }
      localStorage.setItem('bookSearchHistory', JSON.stringify(this.searchHistory))
    },
    clearHistory() {
      this.$confirm('确定要清空搜索历史吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.searchHistory = []
        localStorage.removeItem('bookSearchHistory')
      })
    },
    handleSearch() {
      if (!this.searchQuery.trim()) return
      this.saveSearchHistory(this.searchQuery)
      this.$emit('search', {
        keyword: this.searchQuery
      })
    },
    handleAdvancedSearch() {
      const params = {
        keyword: this.searchQuery,
        ...this.advancedForm
      }
      this.saveSearchHistory(this.searchQuery)
      this.$emit('search', params)
    },
    resetForm() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields()
      }
      this.advancedForm = {
        category: '',
        author: '',
        publisher: '',
        publishYear: null,
        minRating: 0,
        tags: []
      }
    },
    handleHistoryClick(keyword) {
      this.searchQuery = keyword
      this.handleSearch()
    },
    handleHotClick(keyword) {
      this.searchQuery = keyword
      this.handleSearch()
    }
  }
}
</script>

<style scoped>
.book-search {
  .search-header {
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

  .search-box {
    margin-bottom: 20px;
  }

  .advanced-search {
    background-color: var(--background-color-light);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .search-history,
  .hot-search {
    margin-top: 30px;

    h3 {
      margin: 0 0 15px;
      font-size: 16px;
      color: var(--text-color);
    }
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .history-list,
  .hot-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .history-item,
  .hot-item {
    cursor: pointer;
  }

  .hot-count {
    margin-left: 5px;
    font-size: 12px;
    color: var(--text-color-secondary);
  }
}
</style> 