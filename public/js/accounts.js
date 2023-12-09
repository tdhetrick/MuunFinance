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
                    handleResponseError(error)              
                });
        },
        addAccount() {
            let app = this;
            ajx.post('/add_account', this.account)
                .then(response => {
                    this.account = { name: '', balance: 0, account_type: '' };
                    
                    app.getAccounts()
                })
                .catch(error => {
                    alert("Failed to add Account")       
                });
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        }
    },
    template: `

        <h2>Accounts</h2>
        <table class="w3-table w3-bordered w3-striped table-mid-container">
            <caption class="w3-text-grey" style="caption-side: top;">List of Accounts</caption>
            <thead>
                <tr class="w3-teal">
                    <th scope="col">Account Name</th>
                    <th scope="col">Starting Balance</th>
                    <th scope="col">Account Type</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="account in accounts" :key="account.account_id">
                    <td>{{ account.name }}</td>
                    <td>{{ formatCurrency(account.balance) }}</td>
                    <td>{{ account.account_type }}</td>
                </tr>
                <tr v-if="accounts.length === 0">
                    <td colspan="3">No accounts available</td>
                </tr>
            </tbody>
        </table>
        
        <div class="w3-container form-container">
            <h2>Add Account</h2>
            <form @submit.prevent="addAccount" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin w3-padding" aria-label="Add Account Form">
                <p>
                    <label for="accountName" class="w3-text-blue"><b>Account Name</b></label>
                    <input id="accountName" class="w3-input w3-border" type="text" v-model="account.name" required>
                </p>
                <p>
                    <label for="startingBalance" class="w3-text-blue"><b>Starting Balance</b></label>
                    <input id="startingBalance" class="w3-input w3-border" type="number" v-model.number="account.balance" required>
                </p>
                <p>
                    <label for="accountType" class="w3-text-blue"><b>Account Type</b></label>
                    <select id="accountType" class="w3-select w3-border" v-model="account.account_type" required>
                        <option value="" disabled selected>Select your option</option>
                        <option value="Checking">Checking</option>
                        <option value="Savings">Savings</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Investment">Investment</option>
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