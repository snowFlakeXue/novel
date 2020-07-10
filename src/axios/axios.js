import axios from 'axios'
import cookie from 'js-cookie'
axios.create({
    timeout:15000
})
axios.interceptors.request.use(
    config=>{
        if(cookie.get('login_cookie')){
            config.headers['token']=cookie.get('login_cookie')
        }
        if(cookie.get('Authorization')){
            config.headers['Authorization']=cookie.get('Authorization')
        }
        // if(cookie.get('Authorization')){
        //     config.headers['Authorization']=cookie.get('Authorization')
        // }
        return config
    },
    err=>{
        return Promise.reject(err)
    }
)
export default axios;