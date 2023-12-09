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
            <div class="w3-container form-container ">
                <h3 class="">Add transaction</h3>
                <form @submit.prevent="submitTransaction" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin w3-padding">

                    <p>
                        <label class="w3-text-blue"><b>Amount</b></label>
                        <input class="w3-input w3-border" v-model.number="transaction.amount" required>
                    </p>

                    <p>
                        <label class="w3-text-blue"><b>Date</b></label>
                        <input class="w3-input w3-border" type="date" v-model="transaction.date" required>
                    </p>

                    <p>
                        <label class="w3-text-blue"><b>Account</b></label>
                        <select class="w3-select w3-border" v-model="transaction.account_id" required>
                            <option value="" disabled selected>Select your Account</option>
                            <option v-for="ac in this.accounts" :value="ac.account_id">{{ac.name}}</option>
                        </select>
                    </p>

                    <p>
                        <label class="w3-text-blue"><b>Category</b></label>
                        <select class="w3-select w3-border" v-model="transaction.category_id" required>
                            <option value="" disabled selected>Select your option</option>
                            <option v-for="cat in this.categories" :value="cat.category_id">{{cat.name}}</option>
                        </select>
                    </p>
                    <p>
                        <label class="w3-text-blue"><b>Type</b></label>
                        <select class="w3-select w3-border" v-model="transaction.type" required>
                            <option value="" disabled selected>Select your option</option>
                            <option v-for="ty in this.types" :value="ty">{{ty}}</option>
                        </select>
                    </p>
            
                    <p>

                        <button class="w3-btn w3-blue">Submit</button>
                    </p>
                </form>
            </div>
        </div>
        <div class="w3-rest w3-center">
            <h3 class="">Transactions</h3>
            <table class="w3-table w3-bordered w3-striped table-mid-container">
                <thead>
                    <tr class="w3-teal">
                        <th>Amount</th>
                        <th>Account</th>
                        <th>Category</th> 
                        <th>Type</th>  
                        <th>Date</th>
                        <th></th>           
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tr in transactions" :key="tr.id" >
                        <td>{{ formatCurrency(tr.amount) }}</td>
                        <td>{{ tr.account }}</td> 
                        <td>{{ tr.category }}</td> 
                        <td>{{ tr.type }}</td>
                        <td>{{ tr.date }}</td>
                        <td><span class="w3-text-grey w3-large" @click="deleteTransaction(tr.transaction_id)"><i class="fa fa-trash"></i></span></td>    
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