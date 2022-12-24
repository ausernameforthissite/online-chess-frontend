const Endpoints = {

  AUTH: {
    REGISTER: 'http://localhost:8080/api/auth/register',
    LOGIN: 'http://localhost:8080/api/auth/login',
    REFRESH: 'http://localhost:8080/api/auth/refresh',
    LOGOUT: 'http://localhost:8080/api/auth/logout'
  },

  RESOURCES: {
    PROFILE: 'http://localhost:8080/api/profile',
    FIND_MATCH: 'http://localhost:8081/api/find_match'
  }
}

export default Endpoints