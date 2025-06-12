import store from '@/store';

// 获取认证头
export function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 设置认证数据
export function setAuthData(token) {
  localStorage.setItem('token', token);
}

// 清除认证数据
export function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// 统一错误处理
export function handleAPIError(error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        clearAuthData();
        return '登录已过期，请重新登录';
      case 403:
        return '无权执行此操作';
      case 404:
        return '资源不存在';
      default:
        return error.response.data.message || '请求失败';
    }
  }
  return '网络连接异常，请稍后重试';
}