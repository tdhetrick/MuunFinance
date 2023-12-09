export default  {   
    data() {
        return {
            transactions: [],
            accounts:[]
            
        };
    },
    methods: {
  
        getTransactions() {
            ajx.get('/transactions', this.user)
                .then(response => {
                    console.log(response.data)
                    this.transactions = response.data
                })
                .catch(error => {
                    handleResponseError(error)
                });
        },
        getAccounts() {
            ajx.get('/accounts_balance', this.user)
                .then(response => {
                    this.accounts = response.data
                })
                .catch(error => {
                    handleResponseError(error)              
                });
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        }
    },
    template: `
    <div class="w3-rest w3-center">
    <h3>Accounts</h3>
    <table class="w3-table w3-bordered w3-striped table-mid-container">
        <thead>
            <tr class="w3-teal">
                <th>Account Name</th>
                <th>Current Balance</th>
                <th>Account Type</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="account in accounts" :key="account.id">
                <td>{{ account.name }}</td>
                <td>{{ formatCurrency(account.balance) }}</td>
                <td>{{ account.account_type }}</td>
            </tr>
        </tbody>
    </table>
    </div>
    <div class="w3-rest w3-center">
    <h3 class="">Recent Transactions</h3>
        <table class="w3-table w3-bordered w3-striped table-mid-container">
            <thead>
                <tr class="w3-teal">
                    <th>Amount</th>
                    <th>Account</th>
                    <th>Category</th> 
                    <th>Type</th>  
                    <th>Date</th>           
                </tr>
            </thead>
            <tbody>
                <tr v-for="tr in transactions" :key="tr.id" @click="editTransaction(tr.id)">
                    <td>{{ formatCurrency(tr.amount) }}</td>
                    <td>{{ tr.account }}</td> 
                    <td>{{ tr.category }}</td> 
                    <td>{{ tr.type }}</td>
                    <td>{{ tr.date }}</td>    
                </tr>
            </tbody>
        </table>
    </div>
    `,
    mounted(){
        this.getTransactions()
        this.getAccounts()
        document.title = 'MuunFinance Homepage';
        
    }
}