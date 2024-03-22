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
            editingTransactionId: null,
            file: '',
            mapping: null,
            transactionFields: null,
            importFields: null,
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
        deleteTransaction(id) {
            ajx.delete('/delete_transaction/' + id)
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

            } else {
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
        },
        handleFileUpload() {
            this.file = this.$refs.file.files[0];
        },
        uploadFile() {
            let formData = new FormData();
            formData.append('file', this.file);
            formData.append('account_id', this.account_id);  // replace with actual account id

            ajx.post('/upload', formData)  // replace with actual upload URL
                .then(response => {
                    if (response.data.mapping) {
                        this.mapping = response.data.mapping;
                        this.transactionFields = response.data.transactionFields;
                        this.importFields = response.data.importFields;

                        console.log(response.data);
                    } else {
                        console.log(response.data);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        },
        saveMapping() {
            this.mapping.account_id = this.account_id;
            ajx.post('/save_mapping', this.mapping)
                .then(response => {
                    // Handle the response
                    console.log(response.data);
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
        }
    },
    template: `
    <div class="w3-row">
        <div class="w3-col m4 l3 w3-center">
            <div class="w3-container form-container">
                <h3>Add Transaction</h3>
                <form @submit.prevent="submitTransaction"
                    class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin w3-padding"
                    aria-label="Add Transaction Form">

                    <p>
                        <label for="transactionAmount" class="w3-text-blue"><b>Amount</b></label>
                        <input id="transactionAmount" class="w3-input w3-border" type="number"
                            v-model.number="transaction.amount" required>
                    </p>

                    <p>
                        <label for="transactionDate" class="w3-text-blue"><b>Date</b></label>
                        <input id="transactionDate" class="w3-input w3-border" type="date" v-model="transaction.date"
                            required>
                    </p>

                    <p>
                        <label for="transactionAccount" class="w3-text-blue"><b>Account</b></label>
                        <select id="transactionAccount" class="w3-select w3-border" v-model="transaction.account_id"
                            required>
                            <option value="" disabled selected>Select your Account</option>
                            <option v-for="ac in accounts" :value="ac.account_id">{{ac.name}}</option>
                        </select>
                    </p>

                    <p>
                        <label for="transactionCategory" class="w3-text-blue"><b>Category</b></label>
                        <select id="transactionCategory" class="w3-select w3-border" v-model="transaction.category_id"
                            required>
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

            <div class="w3-card w3-margin w3-padding">
                <h2>Upload Transactions</h2>
                <p>
                    <label for="accountId" class="w3-text-blue"><b>Account</b></label>
                    <select id="accountId" class="w3-select w3-border" v-model="account_id" required>
                        <option value="" disabled selected>Select an account</option>
                        <option v-for="account in accounts" :key="account.account_id" :value="account.account_id">{{
                            account.name }}</option>
                    </select>
                </p>

                <form @submit.prevent="uploadFile">
                    <p>
                        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
                    </p>
                    <p>
                        <button class="w3-btn w3-blue" type="submit">Upload</button>
                    </p>
                </form>

                <div id="mapper" class="w3-container form-container" v-if="mapping">
                    <h2>Configure Mapping</h2>
                    <form @submit.prevent="saveMapping"
                        class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin w3-padding"
                        aria-label="Configure Mapping Form">
                        <p v-for="(field, index) in importFields " :key="index">
                            <label :for="field" class="w3-text-blue"><b>{{ field }}</b></label>
                            <select :id="field" class="w3-select w3-border" v-model="mapping[field]" required>
                                <option v-for="(importField, index) in transactionFields" :key="index" :value="importField">{{
                                    importField }}</option>
                            </select>
                        </p>
                        <p>
                            <button type="submit" class="w3-btn w3-blue">Save Mapping</button>
                        </p>
                    </form>
                </div>
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
                        <td><button @click="deleteTransaction(tr.transaction_id)" class="w3-button w3-text-red"><i
                                    class="fa fa-trash" aria-hidden="true"></i><span
                                    class="w3-sr-only">Delete</span></button></td>
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