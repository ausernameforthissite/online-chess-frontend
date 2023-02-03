const Endpoints = {

  AUTH: {
    REGISTER: 'http://localhost:8080/api/auth/register',
    LOGIN: 'http://localhost:8080/api/auth/login',
    REFRESH: 'http://localhost:8080/api/auth/refresh',
    LOGOUT: 'http://localhost:8080/api/auth/logout'
  },

  RESOURCES: {
    FIND_MATCH: 'http://localhost:8081/api/find_match',
    MATCH_STATE_BASE: 'http://localhost:8082/api/match/'
  }
}

export default Endpoints