<template>
  <el-card class="calendar-widget">
    <template #header>
      <div class="card-header">
        <span>日历</span>
        <el-button-group>
          <el-button size="small" @click="handlePrevMonth">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button size="small" @click="handleNextMonth">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </template>
    <div class="calendar-content">
      <div class="calendar-header">
        <div v-for="day in weekDays" :key="day" class="week-day">
          {{ day }}
        </div>
      </div>
      <div class="calendar-body">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="calendar-day"
          :class="{
            'other-month': !day.currentMonth,
            'today': day.isToday,
            'has-event': day.hasEvent
          }"
          @click="handleDayClick(day)"
        >
          <span class="day-number">{{ day.date.getDate() }}</span>
          <div v-if="day.hasEvent" class="event-dot"></div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

export default {
  name: 'CalendarWidget',
  components: {
    ArrowLeft,
    ArrowRight
  },
  data() {
    return {
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      currentDate: new Date(),
      events: []
    }
  },
  computed: {
    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const days = []

      // 填充上个月的日期
      const firstDayWeek = firstDay.getDay()
      for (let i = firstDayWeek - 1; i >= 0; i--) {
        const date = new Date(year, month, -i)
        days.push({
          date,
          currentMonth: false,
          isToday: this.isToday(date),
          hasEvent: this.hasEvent(date)
        })
      }

      // 填充当前月的日期
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i)
        days.push({
          date,
          currentMonth: true,
          isToday: this.isToday(date),
          hasEvent: this.hasEvent(date)
        })
      }

      // 填充下个月的日期
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i)
        days.push({
          date,
          currentMonth: false,
          isToday: this.isToday(date),
          hasEvent: this.hasEvent(date)
        })
      }

      return days
    }
  },
  methods: {
    isToday(date) {
      const today = new Date()
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      )
    },
    hasEvent(date) {
      return this.events.some(event => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        )
      })
    },
    handlePrevMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      )
    },
    handleNextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      )
    },
    handleDayClick(day) {
      this.$emit('day-click', day)
    }
  }
}
</script>

<style scoped>
.calendar-widget {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-content {
  padding: 10px 0;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 10px;
}

.week-day {
  font-weight: bold;
  color: var(--text-color-secondary);
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
  padding: 5px;
}

.calendar-day:hover {
  background-color: var(--background-color-light);
}

.other-month {
  color: var(--text-color-secondary);
}

.today {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
}

.has-event {
  font-weight: bold;
}

.event-dot {
  width: 6px;
  height: 6px;
  background-color: var(--primary-color);
  border-radius: 50%;
  position: absolute;
  bottom: 5px;
}

.day-number {
  font-size: 14px;
}
</style> 