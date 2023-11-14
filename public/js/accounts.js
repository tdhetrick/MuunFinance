export default  {   
    data() {
        return {
            account: {
                name: '',
                balance: 0,
                account_type: ''
            },
            accounts: []
        };
    },
    methods: {
  
        getAccounts() {
            ajx.get('/accounts', this.user)
                .then(response => {
                    this.accounts = response.data
                })
                .catch(error => {
                    console.error('There was an error getting accounts!', error);                 
                });
        },
        addAccount() {
            ajx.post('/add_account', this.account)
                .then(response => {
                    this.account = { name: '', balance: 0, account_type: '' };
                    alert("Account added")
                })
                .catch(error => {
                    alert("Failed to add Account")       
                });
        }
    },
    template: `

    <h2>Accounts</h2>
    <table class="w3-table w3-bordered w3-striped table-mid-container">
        <thead>
            <tr class="w3-teal">
                <th>Account Name</th>
                <th>Balance</th>
                <th>Account Type</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="account in accounts" :key="account.id">
                <td>{{ account.name }}</td>
                <td>{{ account.balance }}</td>
                <td>{{ account.account_type }}</td>
            </tr>
        </tbody>
    </table>
        <div class="w3-container form-container">
            <h2>Add Account</h2>
            <form @submit.prevent="addAccount" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin">
                <p>
                    <label class="w3-text-blue"><b>Account Name</b></label>
                    <input class="w3-input w3-border" type="text" v-model="account.name" required>
                </p>
                <p>
                    <label class="w3-text-blue"><b>Balance</b></label>
                    <input class="w3-input w3-border" type="number" v-model.number="account.balance" required>
                </p>
                <p>
                    <label class="w3-text-blue"><b>Account Type</b></label>
                    <select class="w3-select w3-border" v-model="account.account_type" required>
                        <option value="" disabled selected>Select your option</option>
                        <option value="Checking">Checking</option>
                        <option value="Savings">Savings</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Investment">Investment</option>
                        <!-- Add more account types as needed -->
                    </select>
                    </p>
            
                <p>
                    <button class="w3-btn w3-blue">Submit</button>
                </p>
            </form>
        </div>
    `,
    mounted(){
        this.getAccounts()
    }
}