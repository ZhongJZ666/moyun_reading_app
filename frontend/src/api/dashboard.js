import request from '@/utils/request'

// 导师仪表板API
export const getMentorDashboard = () => {
  return request({
    url: '/mentor/dashboard',
    method: 'get'
  })
}

// 学生仪表板API
export const getStudentDashboard = () => {
  return request({
    url: '/student/dashboard',
    method: 'get'
  })
}

// 管理员仪表板API
export const getAdminDashboard = () => {
  return request({
    url: '/admin/dashboard',
    method: 'get'
  })
}

// 更新待办事项状态
export const updateTodoStatus = (todoId, completed) => {
  return request({
    url: `/todos/${todoId}`,
    method: 'patch',
    data: { completed }
  })
}

// 获取活动列表
export const getActivities = (params) => {
  return request({
    url: '/activities',
    method: 'get',
    params
  })
} 