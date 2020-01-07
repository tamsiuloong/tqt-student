import axios from 'axios'
import vue from 'vue'
import Cookies from 'js-cookie'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let access_token = Cookies.get("TOKEN");
          if (access_token) {
            var params = config.params;
            if (!params) {
              config.params =
                {
                  'access_token': access_token // 让每个请求携带参数access_token
                };
            } else {
              params.access_token = access_token;// 追加
            }
          }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

const request = function (loadtip, query) {
  let loading
  if (loadtip) {
    loading = vue.prototype.$loading({
      lock: false,
      text: '正在加载中…',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.5)'
    })
  }
  return axios.request(query)
    .then(res => {
      if (loadtip) {
        loading.close()
      }
      if (res.data.code === 401) {
        vue.prototype.$$router.push({ path: '/login' })
        return Promise.reject(res.data)
      } else if (res.data.code === 500) {
        return Promise.reject(res.data)
      } else if (res.data.code === 501) {
        return Promise.reject(res.data)
      } else if (res.data.code === 502) {
        vue.prototype.$$router.push({ path: '/login' })
        return Promise.reject(res.data)
      } else {
        return Promise.resolve(res.data)
      }
    })
    .catch(e => {
      if (loadtip) {
        loading.close()
      }
      if(e.response.data.error==='invalid_token'){
        window.location.href="/#/login";
      }
      // vue.prototype.$message.error(e.message)
      return Promise.reject(e)
    })
}

const post = function (url, params) {
  const query = {
    baseURL: process.env.VUE_APP_URL,
    url: url,
    method: 'post',
    data: params
  }
  return request(false, query)
}
const simplePost = function (url, params) {
  const query = {
    baseURL: process.env.VUE_APP_URL,
    url: url,
    method: 'post',
    data: params
  }
  return request(false, query)
}
const postWithAuth = function (url, params) {
  const _params = {
      grant_type:"password",
      username:params.userName,
      password:params.password
    }
  const query = {
    baseURL: process.env.VUE_APP_URL,
    url: url,
    method: 'post',
    timeout: 30000,
    params: _params,
    auth: {
          username: 'tqt',
          password: 'tqt'
    }
  }
  return request(true, query)
}
const postWithLoadTip = function (url, params) {
  const query = {
    baseURL: process.env.VUE_APP_URL,
    url: url,
    method: 'post',
    withCredentials: true,
    timeout: 30000,
    data: params,
    headers: { 'Content-Type': 'application/json', 'request-ajax': true }
  }
  return request(true, query)
}

const postWithOutLoadTip = function (url, params) {
  const query = {
    baseURL: process.env.VUE_APP_URL,
    url: url,
    method: 'post',
    withCredentials: true,
    timeout: 30000,
    data: params,
    headers: { 'Content-Type': 'application/json', 'request-ajax': true }
  }
  return request(false, query)
}

const get = function (url, params) {
  const query = {
    baseURL: process.env.VUE_APP_URL,
    url: url,
    method: 'get',
    timeout: 30000,
    params: params,
    headers: { 'request-ajax': true }
  }
  return request(false, query)
}

const form = function (url, params) {
  const query = {
    baseURL: process.env.VUE_APP_URL,
    url: url,
    method: 'post',
    withCredentials: true,
    timeout: 30000,
    data: params,
    headers: { 'Content-Type': 'multipart/form-data', 'request-ajax': true }
  }
  return request(false, query)
}

export {
  post,
  postWithLoadTip,
  postWithOutLoadTip,
  get,
  form,
  postWithAuth,
  simplePost
}
