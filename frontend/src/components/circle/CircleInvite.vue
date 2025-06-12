<template>
  <div class="circle-invite">
    <div class="invite-header">
      <h3>邀请成员</h3>
      <el-button
        type="primary"
        @click="generateInviteLink"
      >
        生成邀请链接
      </el-button>
    </div>

    <!-- 邀请链接列表 -->
    <el-table
      v-loading="loading"
      :data="inviteLinks"
      style="width: 100%"
    >
      <el-table-column label="邀请链接" min-width="300">
        <template #default="{ row }">
          <div class="invite-link">
            <el-input
              v-model="row.link"
              readonly
              :suffix-icon="Copy"
              @click="copyLink(row.link)"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">
          {{ row.createTime }}
        </template>
      </el-table-column>

      <el-table-column label="有效期" width="180">
        <template #default="{ row }">
          {{ row.expireTime || '永久有效' }}
        </template>
      </el-table-column>

      <el-table-column label="使用次数" width="120">
        <template #default="{ row }">
          {{ row.usedCount }}/{{ row.maxUses || '∞' }}
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag
            :type="getStatusType(row)"
            effect="plain"
          >
            {{ getStatusText(row) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button
            type="danger"
            link
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 生成邀请链接对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="生成邀请链接"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-width="100px"
      >
        <el-form-item label="有效期">
          <el-select v-model="form.expireType">
            <el-option label="永久有效" value="never" />
            <el-option label="1天" value="1d" />
            <el-option label="7天" value="7d" />
            <el-option label="30天" value="30d" />
            <el-option label="自定义" value="custom" />
          </el-select>
          <el-date-picker
            v-if="form.expireType === 'custom'"
            v-model="form.expireTime"
            type="datetime"
            placeholder="选择过期时间"
          />
        </el-form-item>

        <el-form-item label="使用次数">
          <el-input-number
            v-model="form.maxUses"
            :min="1"
            :max="1000"
            placeholder="不限制"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="submitForm"
          >
            生成
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Copy } from '@element-plus/icons-vue'

export default {
  name: 'CircleInvite',
  components: {
    Copy
  },
  props: {
    circleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      loading: false,
      submitting: false,
      dialogVisible: false,
      inviteLinks: [],
      form: {
        expireType: 'never',
        expireTime: null,
        maxUses: null,
        remark: ''
      }
    }
  },
  created() {
    this.fetchInviteLinks()
  },
  methods: {
    async fetchInviteLinks() {
      this.loading = true
      try {
        const response = await this.$http.get(`/api/circles/${this.circleId}/invites`)
        this.inviteLinks = response.data
      } catch (error) {
        this.$message.error('获取邀请链接失败')
      } finally {
        this.loading = false
      }
    },
    generateInviteLink() {
      this.form = {
        expireType: 'never',
        expireTime: null,
        maxUses: null,
        remark: ''
      }
      this.dialogVisible = true
    },
    async submitForm() {
      this.submitting = true
      try {
        const data = {
          expireTime: this.form.expireType === 'never' ? null :
            this.form.expireType === 'custom' ? this.form.expireTime :
            this.calculateExpireTime(this.form.expireType),
          maxUses: this.form.maxUses,
          remark: this.form.remark
        }

        const response = await this.$http.post(
          `/api/circles/${this.circleId}/invites`,
          data
        )
        this.inviteLinks.unshift(response.data)
        this.dialogVisible = false
        this.$message.success('邀请链接生成成功')
      } catch (error) {
        this.$message.error('生成邀请链接失败')
      } finally {
        this.submitting = false
      }
    },
    calculateExpireTime(type) {
      const now = new Date()
      const days = parseInt(type)
      now.setDate(now.getDate() + days)
      return now.toISOString()
    },
    async copyLink(link) {
      try {
        await navigator.clipboard.writeText(link)
        this.$message.success('链接已复制到剪贴板')
      } catch (error) {
        this.$message.error('复制失败，请手动复制')
      }
    },
    getStatusType(link) {
      if (link.expired) return 'info'
      if (link.usedCount >= link.maxUses) return 'warning'
      return 'success'
    },
    getStatusText(link) {
      if (link.expired) return '已过期'
      if (link.usedCount >= link.maxUses) return '已用完'
      return '有效'
    },
    async handleDelete(link) {
      try {
        await this.$confirm('确定要删除该邀请链接吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$http.delete(
          `/api/circles/${this.circleId}/invites/${link.id}`
        )
        const index = this.inviteLinks.findIndex(l => l.id === link.id)
        if (index !== -1) {
          this.inviteLinks.splice(index, 1)
        }
        this.$message.success('邀请链接已删除')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.circle-invite {
  .invite-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      color: var(--text-color);
    }
  }

  .invite-link {
    display: flex;
    gap: 10px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style> 