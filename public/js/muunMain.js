
const Login = Vue.defineAsyncComponent(() => import('./login.js'));

const Accounts = Vue.defineAsyncComponent(() => import('./accounts.js'));
const Categories = Vue.defineAsyncComponent(() => import('./categories.js'));
const Budgets = Vue.defineAsyncComponent(() => import('./budgets.js'));
const Transactions = Vue.defineAsyncComponent(() => import('./transactions.js'));
const Dashboard = Vue.defineAsyncComponent(() => import('./dashboard.js'));
const Homepage = Vue.defineAsyncComponent(() => import('./homepage.js'));

const test = {
    template: `TEST`
}

const muunMain = {
    data() {
        return {
            loggedIn: false,
            activeComp: '',
            timeLeft: 60
        }
    },
    template: `

    <!-- Sidebar -->
    <nav v-if="this.loggedIn" class="w3-sidebar w3-bar-block w3-collapse w3-card w3-animate-left" style="width:150px;" id="mySidebar">
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

    <div v-if="this.loggedIn" class="w3-main w3-padding" style="margin-left:150px">
        <div class="w3-bar w3-teal">
            <a href="#" class="w3-bar-item w3-button w3-mobile"><b>MuunFinance<b></a>           
            <a href="#" class="w3-bar-item w3-button w3-mobile w3-right"  @click="logout">Logout</a>
            
            <div class="w3-bar-item  w3-right">Token expires in: {{ this.timeLeft }} seconds</div>
          
        </div>

        <component :is="activeComp"></component>
    
        

    </div>

    

    
    `,

    methods: {
        isLoggedin(val) {
            console.log(val)
            this.loggedIn = val
            this.timeLeft = 60;
            this.startTimer()

        },
        logout() {
            axios.post('/logout')
                .then(response => {

                })
                .catch(error => {
                    console.error('Logout failed', error);
                });

            localStorage.removeItem('access_token');
            window.location.href = "/";
        },
        startTimer() {
            this.timer = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft -= 1;
                } else {
                    this.clearTimer();

                }
            }, 1000);
        },
        clearTimer() {
            clearInterval(this.timer);
            
            this.timer = null;
            this.logout()
        },
        resetTimer(){
            this.timeLeft = 60;
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
    mounted() {
        if (localStorage.getItem('access_token')) {
            this.loggedIn = true;
            this.startTimer();


        } else {
            this.loggedIn = false;
        }
        window.addEventListener('click', this.resetTimer);
        window.addEventListener('keypress', this.resetTimer);
        console.log(this.loggedIn)
        this.activeComp = "Homepage"
    },
    beforeDestroy() {
        this.clearTimer();

        window.removeEventListener('click', this.resetTimer);
        window.removeEventListener('keypress', this.resetTimer);
      }
}



const ajx = axios.create({
    baseURL: `${window.location.protocol}//${window.location.host}/`,
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
        if (error.response.status){
            if (error.response.status === 401) {
                localStorage.removeItem('access_token')
                window.location.href = "/";
            }
        }else{
            console.log(error)
        }
        
        return Promise.reject(error);
    }
);

function handleResponseError(e) {
    console.log(e)
    //window.location.href = "/";
}

window.handleResponseError = handleResponseError

window.ajx = ajx;

const app = Vue.createApp(muunMain)
app.mount('#muun')
