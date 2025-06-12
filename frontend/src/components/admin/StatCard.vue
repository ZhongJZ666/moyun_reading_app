<template>
  <el-card class="stat-card" :body-style="{ padding: '20px' }">
    <div class="stat-icon">
      <el-icon :size="24">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="stat-content">
      <div class="stat-value">{{ value }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.stat-icon {
  margin-right: 20px;
  color: var(--primary-color);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-color);
}

.stat-label {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin-top: 5px;
}
</style> 