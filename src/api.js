import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const authAPI = {
  signup:          (data)    => api.post('/auth/signup', data),
  login:           (data)    => api.post('/auth/login', data),
  logout:          ()        => api.post('/auth/logout'),
  me:              ()        => api.get('/auth/me'),
  forgotPassword:  (email)   => api.post('/auth/forgotPassword', { email }),
  verifyOtp:       (data)    => api.post('/auth/verifyOtp', data),
  resetPassword:   (data)    => api.post('/auth/resetPassword', data),
  onboard:         (data)    => api.post('/auth/onboard', data),
  // OAuth2 — full browser redirect (not proxied)
  googleLogin:     ()        => { window.location.href = 'http://localhost:8080/oauth2/authorization/google'; },
  githubLogin:     ()        => { window.location.href = 'http://localhost:8080/oauth2/authorization/github'; },
};

export const urlAPI = {
  generate: (data) => api.post('/generate', data), // public endpoint
};

export const analyticsAPI = {
  getMyUrls:          (page = 0, size = 10) => api.get(`/analytics/urls?page=${page}&size=${size}`),
  getTotalClicks:     ()                    => api.get('/analytics/totalClicks'),
  getClicks30:        ()                    => api.get('/analytics/clicks30'),
  getCountryAnalytics:()                    => api.get('/analytics/countryAnalytics'),
  getClicksByUrl:     (urlId)               => api.get(`/analytics/clickByUrl/${urlId}`),
};

export const apiKeyAPI = {
  generate: () => api.post('/generate-api-key'),
};

export const adminAPI = {
  dashboard:        ()              => api.get('/admin/dashboard'),
  getUsers:         (page = 0)      => api.get(`/admin/users?page=${page}&size=10`),
  searchUsers:      (keyword, page) => api.get(`/admin/users/search?keyword=${keyword}&page=${page}&size=10`),
  deleteById:       (id)            => api.delete(`/admin/users/${id}`),
  deleteByEmail:    (email)         => api.delete(`/admin/users/email/${email}`),
  deleteByUsername: (username)      => api.delete(`/admin/users/username/${username}`),
  userDashboard:    (id)            => api.get(`/admin/userDashboard/${id}`),
};

export default api;
