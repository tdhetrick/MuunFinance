
const Login = Vue.defineAsyncComponent(() => import('./login.js'));

const Accounts = Vue.defineAsyncComponent(() =>import('./accounts.js'));
const Categories = Vue.defineAsyncComponent(() =>import('./categories.js'));
const Budgets = Vue.defineAsyncComponent(() =>import('./budgets.js'));
const Transactions = Vue.defineAsyncComponent(() =>import('./transactions.js'));
const Dashboard = Vue.defineAsyncComponent(() =>import('./dashboard.js'));
const Homepage = Vue.defineAsyncComponent(() =>import('./homepage.js'));

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
        <a href="#" class="w3-bar-item w3-button" @click="activeComp = 'Homepage'">Homepage</a>
        <a href="#" class="w3-bar-item w3-button" @click="activeComp = 'Dashboard'">Dashboard</a>
        <a href="#" class="w3-bar-item w3-button" @click="activeComp = 'Accounts'">Accounts</a>
        <a href="#" class="w3-bar-item w3-button" @click="activeComp = 'Categories'">Categories</a>  
        <a href="#" class="w3-bar-item w3-button" @click="activeComp = 'Budgets'">Budgets</a>
        <a href="#" class="w3-bar-item w3-button" @click="activeComp = 'Transactions'">Transactions</a>
        <!--<a href="#" class="w3-bar-item w3-button" @click="activeComp = 'test'">Settings</a>-->
    </nav>

    <Login v-if="!this.loggedIn" @loggedin="isLoggedin"></Login>

    <div v-if="this.loggedIn" class="w3-main w3-padding" style="margin-left:200px">
        <div class="w3-bar w3-teal">
            <a href="#" class="w3-bar-item w3-button w3-mobile"><b>MuunFinance<b></a>           
            <a href="#" class="w3-bar-item w3-button w3-mobile w3-right"  @click="logout">Logout</a>
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
            axios.post('/logout')
            .then(response => {
                
            })
            .catch(error => {
              console.error('Logout failed', error);
            });

            localStorage.removeItem('access_token');
            window.location.href = "/"; 
        }      

    },
    components: {
        Login,
        Accounts,
        Categories,
        Budgets,
        Transactions,
        Dashboard,
        Homepage
       
      },
    mounted(){
        if (localStorage.getItem('access_token')) {
            this.loggedIn = true;
          } else {
            this.loggedIn = false;
          }
        console.log(this.loggedIn) 
        this.activeComp  = "Homepage"
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
            window.location.href = "/"; 
        }
        return Promise.reject(error);
    }
);

function handleResponseError(e){
    console.log(e)
    window.location.href = "/";
}

window.ajx = ajx;

const app = Vue.createApp(muunMain)
app.mount('#muun')
