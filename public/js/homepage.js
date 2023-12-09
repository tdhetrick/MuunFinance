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
                <caption class="w3-text-grey">List of Accounts</caption>
                <thead>
                    <tr class="w3-teal">
                        <th scope="col">Account Name</th>
                        <th scope="col">Current Balance</th>
                        <th scope="col">Account Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="account in accounts" :key="account.id">
                        <td>{{ account.name }}</td>
                        <td>{{ formatCurrency(account.balance) }}</td>
                        <td>{{ account.account_type }}</td>
                    </tr>
                    <tr v-if="accounts.length === 0">
                        <td colspan="3">No accounts available</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w3-rest w3-center">
            <h3>Recent Transactions</h3>
            <table class="w3-table w3-bordered w3-striped table-mid-container">
                <caption class="w3-text-grey">List of Recent Transactions</caption>
                <thead>
                    <tr class="w3-teal">
                        <th scope="col">Amount</th>
                        <th scope="col">Account</th>
                        <th scope="col">Category</th> 
                        <th scope="col">Type</th>  
                        <th scope="col">Date</th>           
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tr in transactions" :key="tr.id" @click="editTransaction(tr.id)" class="transaction-row">
                        <td>{{ formatCurrency(tr.amount) }}</td>
                        <td>{{ tr.account }}</td> 
                        <td>{{ tr.category }}</td> 
                        <td>{{ tr.type }}</td>
                        <td>{{ tr.date }}</td>    
                    </tr>
                    <tr v-if="transactions.length === 0">
                        <td colspan="5">No transactions found</td>
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