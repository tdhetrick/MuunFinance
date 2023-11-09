export default {   
    data (){
        return{

            showLogin: true,
            showRegister: false,  
            loggedIn : true,
            user: {
                full_name: '',
                email: '',
                password: ''
            }  
        }

    },
    template: `

    <!-- Login Form -->
    <div class="w3-card-4" v-if="showLogin">
        <div class="w3-container w3-teal">
            <h2>Login</h2>
        </div>
        <form class="w3-container" @submit.prevent="login">
            <p>
                <input class="w3-input" type="email" v-model="user.email" required placeholder="Email">
            </p>
            <p>
                <input class="w3-input" type="password" v-model="user.password" required placeholder="Password">
            </p>
            <p>
                <button class="w3-btn w3-teal">Login</button>
            </p>
            <p class="w3-center">
                <a href="#" @click="toggleForm">Need an account? Register</a>
            </p>
        </form>
    </div>

    <!-- Register Form -->
    <div class="w3-card-4" v-if="showRegister">
        <div class="w3-container w3-teal">
            <h2>Register</h2>
        </div>
        <form class="w3-container" @submit.prevent="register">
            <p>
                <input class="w3-input" type="text" v-model="user.full_name" required placeholder="Full Name">
            </p>
            <p>
                <input class="w3-input" type="email" v-model="user.email" required placeholder="Email">
            </p>
            <p>
                <input class="w3-input" type="password" v-model="user.password" required placeholder="Password">
            </p>
            <p>
                <button class="w3-btn w3-teal">Register</button>
            </p>
            <p class="w3-center">
                <a href="#" @click="toggleForm">Already have an account? Login</a>
            </p>
        </form>
    </div>

    
    `,
    methods: {
        toggleForm() {
            this.showLogin = !this.showLogin;
            this.showRegister = !this.showRegister;
        },
        login() {
            axios.post('http://127.0.0.1:5000/login', this.user)
                .then(response => {
                    // Handle success, save token to localStorage
                    localStorage.setItem('access_token', response.data.access_token);
                    this.loggedIn = true;
                    // Redirect to another page or do something else
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    this.loggedIn = false;
                });
        },
        register() {
            axios.post('http://127.0.0.1:5000/register', this.user)
                .then(response => {
                    // Handle success
                    alert('Registration successful. You can now log in.');
                    // Redirect to login page or directly log in the user
                    window.location.href = '/login.html';
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    alert('Registration failed.');
                });
        }
    }
}


