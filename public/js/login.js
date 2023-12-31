export default {   
    data (){
        return{

            showLogin: true,
            showRegister: false,  
            loggedIn : true,
            user: {
                full_name: '',
                email: '',
                password: '',
                reg_code:''
            }  
        }

    },
    template: `
    <style>
        .form-container {
            max-width: 400px; /* Adjust the size of the form */
            margin: auto; /* Center the form */
            padding-top: 50px; /* Add some space at the top */
        }
    </style>
    <!-- Login Form -->
    <div class="w3-card-4 form-container w3-margin-top" v-if="showLogin">
        <div class="w3-container w3-teal">
            <h2>Login</h2>
        </div>
        <form class="w3-container" @submit.prevent="login">
            <p>
                <input class="w3-input" type="email" v-model="user.email" required placeholder="Email" id="email">
            </p>
            <p>
                <input class="w3-input" type="password" v-model="user.password" required placeholder="Password" id="password">
            </p>
            <p>
                <button class="w3-btn w3-teal" id="login_btn">Login</button>
            </p>
            <p class="w3-center">
                <a href="#" @click="toggleForm">Need an account? Register</a>
            </p>
        </form>
    </div>

    <!-- Register Form -->
    <div class="w3-card-4 form-container" v-if="showRegister">
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
                <input class="w3-input" type="text" v-model="user.reg_code" required placeholder="Registration Code">
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
            ajx.post('/login', this.user)
                .then(response => {
                    // Handle success, save token to localStorage
                    localStorage.setItem('access_token', response.data.access_token);
                    this.loggedIn = true;
                    // Redirect to another page or do something else
                    console.log('Login Success!')
                    this.$emit('loggedin', true)
                })
                .catch(error => {
                    if (error.response && error.response.status === 401 ) {
                        if (error.response.data) {
                            
                            alert('Login failed: please try again');
                        } else {
                            alert('Login failed due to a bad request.');
                        }

                    }
                    console.error('There was an error!', error);
                    this.loggedIn = false;
                    this.$emit('loggedin', false)
                });
        },
        register() {
            ajx.post('/register', this.user)
                .then(response => {
                    // Handle success
                    alert('Registration successful. You can now log in.');
                    // Redirect to login page or directly log in the user
                    window.location.href = '/';
                })
                .catch(error => {
                    if (error.response && error.response.status === 400 || error.response.status === 409) {
                        // Handle 400 error specifically
                        console.error('Bad request error:', error.response);
                        if (error.response.data) {
                            // You can use error.response.data here
                            alert('Registration failed: ' + error.response.data.message);
                        } else {
                            alert('Registration failed due to a bad request.');
                        }
                    } else {
                        console.error('There was an error!', error);
                        alert('Registration failed.');

                    }

                });
        }
    },
    mounted(){
        document.title = 'MuunFinance Login';
    }
}


