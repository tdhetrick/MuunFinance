
const Login = Vue.defineAsyncComponent(() => import('./login.js'));

const Accounts = Vue.defineAsyncComponent(() =>import('./accounts.js'));

const test = {
    template:`TEST`
}

const muunMain = {   
    data (){
        return{
            loggedIn : false,
            activeComp: ''
            
        }

    },
    template: `

    <!-- Sidebar -->
    <nav v-if="this.loggedIn" class="w3-sidebar w3-bar-block w3-collapse w3-card w3-animate-left" style="width:200px;" id="mySidebar">
        <button class="w3-bar-item w3-button w3-large w3-hide-large" onclick="w3_close()">Close &times;</button>
        <a href="#" class="w3-bar-item w3-button">Dashboard</a>
        <a href="#" class="w3-bar-item w3-button" @click="activeComp = 'Accounts'">Accounts</a>
        <a href="#" class="w3-bar-item w3-button">Transactions</a>
        <a href="#" class="w3-bar-item w3-button">Budgets</a>
        <a href="#" class="w3-bar-item w3-button">Reports</a>
        <a href="#" class="w3-bar-item w3-button" @click="activeComp = 'test'">Settings</a>
    </nav>

    <Login v-if="!this.loggedIn" @loggedin="isLoggedin"></Login>

    <div v-if="this.loggedIn" class="w3-main" style="margin-left:200px">
        <div class="w3-teal">
        
            <div class="w3-container">
                <h1>Your App Name</h1>
            </div>
        </div>

        <component :is="activeComp"></component>
        
        <footer class="w3-container w3-teal">
            <p>Footer information goes here</p>
        </footer>
    </div>

    

    
    `,
    
    methods: {
        isLoggedin(val){
            console.log(val)
            this.loggedIn = val
            
        },
        logout(){
            localStorage.removeItem('access_token')
        }      

    },
    components: {
        Login,
        Accounts,
       
      },
    mounted(){
        if (localStorage.getItem('access_token')) {
            this.loggedIn = true;
          } else {
            this.loggedIn = false;
          }
        console.log(this.loggedIn)  
    }  
}



const ajx = axios.create({
    baseURL: 'http://127.0.0.1:5000/',
    timeout: 1000
});

ajx.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

ajx.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            localStorage.removeItem('access_token')
        }
        return Promise.reject(error);
    }
);

// Export this so you can import it into other JS files
window.ajx = ajx;

const app = Vue.createApp(muunMain)
app.mount('#muun')
