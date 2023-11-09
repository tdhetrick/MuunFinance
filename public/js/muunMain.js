//import { defineAsyncComponent } from 'vue';

const Login = Vue.defineAsyncComponent(() =>
  import('./login.js')
);

const muunMain = {   
    data (){
        return{

            
        }

    },
    template: `

   <Login></Login>

    
    `,
    
    methods: {

    },
    components: {
        Login
      }
}



const API = axios.create({
    baseURL: 'http://localhost:5000/',
    timeout: 1000
});

API.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

API.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            // Token is invalid or expired
            // Handle logout, redirect to login, or refresh token
        }
        return Promise.reject(error);
    }
);

// Export this so you can import it into other JS files
window.API = API;

const app = Vue.createApp(muunMain)
app.mount('#muun')
