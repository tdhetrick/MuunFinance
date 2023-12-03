export default  {   
    data() {
        return {
            budget: {
                amount: 0,
                category_id: null,                
            },
            budgets: [],
            categories: []
        };
    },
    methods: {
  
        getbudgets() {
            ajx.get('/budgets', this.user)
                .then(response => {
                    console.log(response.data)
                    this.budgets = response.data
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
                    console.error('There was an error getting categories!', error);                 
                });
        },
        addbudget() {
            let app = this;
            ajx.post('/add_budget', this.budget)
                .then(response => {
                    this.budget = { amount: 0,  category_id: null };
                    
                    this.getbudgets()
                })
                .catch(error => {
                    alert("Failed to add budget")  
                });
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        }
    },
    template: `

    <p><h2>Budgets</h2></p>
    <table class="w3-table w3-bordered w3-striped table-mid-container">
        <thead>
            <tr class="w3-teal">
                <th>Amount</th>
                <th>Category</th>              
            </tr>
        </thead>
        <tbody>
            <tr v-for="budget in budgets" :key="budget.id">
                <td>{{ formatCurrency(budget.amount) }}</td>
                <td>{{ budget.category.name }}</td>  
            </tr>
        </tbody>
    </table>
        <div class="w3-container form-container ">
            <h2>Add budget</h2>
            <form @submit.prevent="addbudget" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin w3-padding">
    
                <p>
                    <label class="w3-text-blue"><b>Amount</b></label>
                    <input class="w3-input w3-border" type="number" v-model.number="budget.amount" required>
                </p>

                <p>
                    <label class="w3-text-blue"><b>Category</b></label>
                    <select class="w3-select w3-border" v-model="budget.category_id" required>
                        <option value="" disabled selected>Select your option</option>
                        <option v-for="cat in this.categories" :value="cat.category_id">{{cat.name}}</option>
                    </select>
                </p>
        
                <p>
    
                    <button class="w3-btn w3-blue">Submit</button>
                </p>
            </form>
        </div>
    `,
    mounted(){
        this.getbudgets()
        this.getcategories()
    }
}