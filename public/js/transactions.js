const Accounts = Vue.defineAsyncComponent(() => import('./accounts.js'));

export default {
    data() {
        return {
            transaction: {
                category_id: null,
                account_id: null,
                amount: 0,
                type: null,
                date: null,
                description: '',
            },
            transactions: [],
            categories: [],
            accounts: [],
            types: ['Credit', 'Debit', 'Transfer'],
            updateMode: false,
            transactionId: null,
            editingTransactionId: null
        };
    },
    methods: {
        gettransactions() {
            ajx.get('/transactions', this.user)
                .then(response => {
                    console.log(response.data)
                    this.transactions = response.data
                })
                .catch(error => {
                    handleResponseError(error)
                });
        },
        getcategories() {
            ajx.get('/categories', this.user)
                .then(response => {
                    console.log(response.data)
                    this.categories = response.data
                })
                .catch(error => {
                    handleResponseError(error)
                });
        },
        getAccounts() {
            ajx.get('/accounts', this.user)
                .then(response => {
                    this.accounts = response.data
                })
                .catch(error => {
                    handleResponseError(error)
                });
        },
        deleteTransaction(id){
            ajx.delete('/delete_transaction/'+id)
            .then(response => {
                this.gettransactions()

            })
            .catch(error => {
                alert("Failed to delete transaction")
            });

        },
        submitTransaction() {
            let app = this;



            if (this.editingTransactionId == null) {
                ajx.post('/add_transaction', this.transaction)
                .then(response => {
                    app.transaction.amount = 0;

                    app.gettransactions()
                })
                .catch(error => {
                    alert("Failed to update transaction")
                });

            }else {
                ajx.post('/update_transaction/' + this.editingTransactionId, this.transaction)
                .then(response => {
                    app.transaction.amount = 0;

                    app.gettransactions()
                })
                .catch(error => {
                    alert("Failed to add transaction")
                });
            }
     
        },
        editTransaction(transactionId) { //@click="this.editTransaction(tr.transaction_id)"
            const transactionToEdit = this.transactions.find(tr => tr.transaction_id === transactionId);
            if (transactionToEdit) {
                this.transaction = transactionToEdit;
                this.transactionId = transactionId;
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        }
    },
    template: `
    <div class="w3-row">
        <div class="w3-col m4 l3 w3-center">
            <div class="w3-container form-container">
                <h3>Add Transaction</h3>
                <form @submit.prevent="submitTransaction" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin w3-padding" aria-label="Add Transaction Form">

                    <p>
                        <label for="transactionAmount" class="w3-text-blue"><b>Amount</b></label>
                        <input id="transactionAmount" class="w3-input w3-border" type="number" v-model.number="transaction.amount" required>
                    </p>

                    <p>
                        <label for="transactionDate" class="w3-text-blue"><b>Date</b></label>
                        <input id="transactionDate" class="w3-input w3-border" type="date" v-model="transaction.date" required>
                    </p>

                    <p>
                        <label for="transactionAccount" class="w3-text-blue"><b>Account</b></label>
                        <select id="transactionAccount" class="w3-select w3-border" v-model="transaction.account_id" required>
                            <option value="" disabled selected>Select your Account</option>
                            <option v-for="ac in accounts" :value="ac.account_id">{{ac.name}}</option>
                        </select>
                    </p>

                    <p>
                        <label for="transactionCategory" class="w3-text-blue"><b>Category</b></label>
                        <select id="transactionCategory" class="w3-select w3-border" v-model="transaction.category_id" required>
                            <option value="" disabled selected>Select your option</option>
                            <option v-for="cat in categories" :value="cat.category_id">{{cat.name}}</option>
                        </select>
                    </p>

                    <p>
                        <label for="transactionType" class="w3-text-blue"><b>Type</b></label>
                        <select id="transactionType" class="w3-select w3-border" v-model="transaction.type" required>
                            <option value="" disabled selected>Select your option</option>
                            <option v-for="ty in types" :value="ty">{{ty}}</option>
                        </select>
                    </p>
            
                    <p>
                        <button class="w3-btn w3-blue">Submit</button>
                    </p>
                </form>
            </div>
        </div>
        <div class="w3-rest w3-center">
            <h3>Transactions</h3>
            <table class="w3-table w3-bordered w3-striped table-mid-container">
                <caption class="w3-text-grey" style="caption-side: top;">List of Transactions</caption>
                <thead>
                    <tr class="w3-teal">
                        <th scope="col">Amount</th>
                        <th scope="col">Account</th>
                        <th scope="col">Category</th> 
                        <th scope="col">Type</th>  
                        <th scope="col">Date</th>
                        <th scope="col">Actions</th>           
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tr in transactions" :key="tr.transaction_id">
                        <td>{{ formatCurrency(tr.amount) }}</td>
                        <td>{{ tr.account }}</td> 
                        <td>{{ tr.category }}</td> 
                        <td>{{ tr.type }}</td>
                        <td>{{ tr.date }}</td>
                        <td><button @click="deleteTransaction(tr.transaction_id)" class="w3-button w3-text-red"><i class="fa fa-trash" aria-hidden="true"></i><span class="w3-sr-only">Delete</span></button></td>    
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    `,
    mounted() {
        this.gettransactions()
        this.getcategories()
        this.getAccounts()
    }
}