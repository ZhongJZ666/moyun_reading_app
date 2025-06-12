<template>
  <div class="admin-dashboard">
    <h1>管理员工作台</h1>
    
    <!-- 数据筛选器 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            @change="handleFilterChange"
          />
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="filterForm.dataType" @change="handleFilterChange">
            <el-option label="全部" value="all" />
            <el-option label="用户数据" value="users" />
            <el-option label="活动数据" value="activities" />
            <el-option label="系统数据" value="system" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilterChange">应用筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="dashboard-content">
      <el-col :span="8">
        <el-card v-loading="loading.stats">
          <template #header>
            <div class="card-header">
              <span>用户统计</span>
              <div class="header-actions">
                <el-button type="text" @click="refreshStats">
                  <el-icon><Refresh /></el-icon>
                </el-button>
                <el-dropdown @command="handleExport">
                  <el-button type="text">
                    <el-icon><Download /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="exportUsers">导出用户数据</el-dropdown-item>
                      <el-dropdown-item command="exportStats">导出统计数据</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </template>
          <div class="user-stats">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ stats.totalUsers }}</div>
                  <div class="stat-label">总用户</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ stats.mentors }}</div>
                  <div class="stat-label">导师</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ stats.students }}</div>
                  <div class="stat-label">学生</div>
                </div>
              </el-col>
            </el-row>
            <el-divider />
            <div class="chart-container">
              <div ref="userChart" style="width: 100%; height: 200px;"></div>
            </div>
            <el-divider />
            <div class="chart-container">
              <div ref="userTrendChart" style="width: 100%; height: 200px;"></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading.system">
          <template #header>
            <div class="card-header">
              <span>系统状态</span>
              <el-button type="text" @click="refreshSystemStatus">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </div>
          </template>
          <div class="system-status">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="服务器状态">
                <el-tag :type="systemStatus.server ? 'success' : 'danger'">
                  {{ systemStatus.server ? '正常' : '异常' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="数据库状态">
                <el-tag :type="systemStatus.database ? 'success' : 'danger'">
                  {{ systemStatus.database ? '正常' : '异常' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="最后更新">
                {{ lastUpdate }}
              </el-descriptions-item>
            </el-descriptions>
            <el-divider />
            <div class="system-metrics">
              <el-progress 
                :percentage="systemStatus.cpuUsage" 
                :format="format => `CPU: ${format}%`"
                :status="getCpuStatus(systemStatus.cpuUsage)"
              />
              <el-progress 
                :percentage="systemStatus.memoryUsage" 
                :format="format => `内存: ${format}%`"
                :status="getMemoryStatus(systemStatus.memoryUsage)"
              />
              <el-progress 
                :percentage="systemStatus.diskUsage" 
                :format="format => `磁盘: ${format}%`"
                :status="getDiskStatus(systemStatus.diskUsage)"
              />
            </div>
            <el-divider />
            <div class="chart-container">
              <div ref="systemTrendChart" style="width: 100%; height: 200px;"></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading.activities">
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <div class="header-actions">
                <el-button type="text" @click="refreshActivities">
                  <el-icon><Refresh /></el-icon>
                </el-button>
                <el-button type="text" @click="exportActivities">
                  <el-icon><Download /></el-icon>
                </el-button>
              </div>
            </div>
          </template>
          <div class="activity-list">
            <el-empty v-if="!activities.length" description="暂无活动" />
            <el-timeline v-else>
              <el-timeline-item
                v-for="activity in activities"
                :key="activity.id"
                :timestamp="activity.time"
                :type="activity.type"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
          <el-divider />
          <div class="chart-container">
            <div ref="activityChart" style="width: 100%; height: 200px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAdminDashboard } from '@/api/dashboard'
import { exportUsers, exportStats, exportActivities } from '@/api/export'
import { Refresh, Download } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

export default {
  name: 'AdminDashboard',
  components: {
    Refresh,
    Download
  },
  data() {
    return {
      stats: {
        totalUsers: 0,
        mentors: 0,
        students: 0
      },
      systemStatus: {
        server: true,
        database: true,
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0
      },
      lastUpdate: '',
      activities: [],
      loading: {
        stats: false,
        system: false,
        activities: false
      },
      userChart: null,
      userTrendChart: null,
      systemTrendChart: null,
      activityChart: null,
      filterForm: {
        dateRange: [],
        dataType: 'all'
      },
      dateShortcuts: [
        {
          text: '最近一周',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          }
        },
        {
          text: '最近一个月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
          }
        },
        {
          text: '最近三个月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
          }
        }
      ]
    }
  },
  async created() {
    await this.fetchDashboardData()
  },
  mounted() {
    this.initCharts()
  },
  beforeUnmount() {
    this.disposeCharts()
  },
  methods: {
    async fetchDashboardData() {
      try {
        const { data } = await getAdminDashboard()
        this.stats = data.stats
        this.systemStatus = data.systemStatus
        this.lastUpdate = data.lastUpdate
        this.activities = data.activities
        this.updateCharts()
      } catch (error) {
        this.$message.error('获取数据失败：' + error.message)
      }
    },
    initCharts() {
      this.userChart = echarts.init(this.$refs.userChart)
      this.userTrendChart = echarts.init(this.$refs.userTrendChart)
      this.systemTrendChart = echarts.init(this.$refs.systemTrendChart)
      this.activityChart = echarts.init(this.$refs.activityChart)
      this.updateCharts()
    },
    disposeCharts() {
      [this.userChart, this.userTrendChart, this.systemTrendChart, this.activityChart].forEach(chart => {
        if (chart) {
          chart.dispose()
        }
      })
    },
    updateCharts() {
      this.updateUserChart()
      this.updateUserTrendChart()
      this.updateSystemTrendChart()
      this.updateActivityChart()
    },
    updateUserChart() {
      if (!this.userChart) return
      
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '用户分布',
            type: 'pie',
            radius: '50%',
            data: [
              { value: this.stats.mentors, name: '导师' },
              { value: this.stats.students, name: '学生' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      
      this.userChart.setOption(option)
    },
    updateUserTrendChart() {
      if (!this.userTrendChart) return
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['总用户', '导师', '学生']
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '总用户',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230]
          },
          {
            name: '导师',
            type: 'line',
            data: [20, 22, 21, 24, 20, 30]
          },
          {
            name: '学生',
            type: 'line',
            data: [100, 110, 80, 110, 70, 200]
          }
        ]
      }
      
      this.userTrendChart.setOption(option)
    },
    updateSystemTrendChart() {
      if (!this.systemTrendChart) return
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['CPU', '内存', '磁盘']
        },
        xAxis: {
          type: 'category',
          data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
        },
        yAxis: {
          type: 'value',
          max: 100
        },
        series: [
          {
            name: 'CPU',
            type: 'line',
            data: [30, 40, 35, 50, 49, 60]
          },
          {
            name: '内存',
            type: 'line',
            data: [50, 55, 52, 58, 60, 65]
          },
          {
            name: '磁盘',
            type: 'line',
            data: [70, 72, 71, 73, 75, 78]
          }
        ]
      }
      
      this.systemTrendChart.setOption(option)
    },
    updateActivityChart() {
      if (!this.activityChart) return
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['活动数量']
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '活动数量',
            type: 'bar',
            data: [5, 7, 3, 8, 6, 10, 4]
          }
        ]
      }
      
      this.activityChart.setOption(option)
    },
    getCpuStatus(usage) {
      if (usage >= 90) return 'exception'
      if (usage >= 70) return 'warning'
      return 'success'
    },
    getMemoryStatus(usage) {
      if (usage >= 90) return 'exception'
      if (usage >= 70) return 'warning'
      return 'success'
    },
    getDiskStatus(usage) {
      if (usage >= 90) return 'exception'
      if (usage >= 70) return 'warning'
      return 'success'
    },
    async refreshStats() {
      this.loading.stats = true
      try {
        const { data } = await getAdminDashboard()
        this.stats = data.stats
        this.updateCharts()
      } catch (error) {
        this.$message.error('刷新统计数据失败：' + error.message)
      } finally {
        this.loading.stats = false
      }
    },
    async refreshSystemStatus() {
      this.loading.system = true
      try {
        const { data } = await getAdminDashboard()
        this.systemStatus = data.systemStatus
        this.lastUpdate = data.lastUpdate
        this.updateCharts()
      } catch (error) {
        this.$message.error('刷新系统状态失败：' + error.message)
      } finally {
        this.loading.system = false
      }
    },
    async refreshActivities() {
      this.loading.activities = true
      try {
        const { data } = await getAdminDashboard()
        this.activities = data.activities
        this.updateCharts()
      } catch (error) {
        this.$message.error('刷新活动列表失败：' + error.message)
      } finally {
        this.loading.activities = false
      }
    },
    async handleExport(command) {
      try {
        let response
        switch (command) {
          case 'exportUsers':
            response = await exportUsers()
            break
          case 'exportStats':
            response = await exportStats()
            break
          default:
            return
        }
        
        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${command}_${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        this.$message.success('导出成功')
      } catch (error) {
        this.$message.error('导出失败：' + error.message)
      }
    },
    async exportActivities() {
      try {
        const response = await exportActivities()
        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `activities_${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        this.$message.success('导出成功')
      } catch (error) {
        this.$message.error('导出失败：' + error.message)
      }
    },
    handleFilterChange() {
      this.fetchDashboardData()
    },
    resetFilter() {
      this.filterForm = {
        dateRange: [],
        dataType: 'all'
      }
      this.fetchDashboardData()
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.dashboard-content {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.user-stats,
.system-status,
.activity-list {
  min-height: 200px;
}

.stat-item {
  text-align: center;
  padding: 20px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  margin-top: 8px;
  color: #666;
}

.chart-container {
  margin-top: 20px;
}

.system-metrics {
  margin-top: 20px;
}

.system-metrics .el-progress {
  margin-bottom: 15px;
}

.el-timeline {
  padding: 0;
  margin: 0;
}
</style>