export default  {   
    data() {
        return {
            category: {
                name: '',
                description: '',                
            },
            categories: []
        };
    },
    methods: {
  
        getcategories() {
            ajx.get('/categories', this.user)
                .then(response => {
                    this.categories = response.data
                })
                .catch(error => {
                    handleResponseError(error)          
                });
        },
        addcategory() {
            let app = this;
            ajx.post('/add_category', this.category)
                .then(response => {
                    this.category = { name: '', balance: 0, category_type: '' };
                    
                    this.getcategories()
                })
                .catch(error => {
                    alert("Failed to add category")       
                });
        }
    },
    template: `

    <h2>Categories</h2>
    <table class="w3-table w3-bordered w3-striped table-mid-container">
        <thead>
            <tr class="w3-teal">
                <th>category Name</th>
                <th>Description</th>              
            </tr>
        </thead>
        <tbody>
            <tr v-for="category in categories" :key="category.id">
                <td>{{ category.name }}</td>
                <td>{{ category.description }}</td>  
            </tr>
        </tbody>
    </table>
        <div class="w3-container form-container ">
            <h2>Add category</h2>
            <form @submit.prevent="addcategory" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin w3-padding">
                <p>
                    <label class="w3-text-blue"><b>Category Name</b></label>
                    <input class="w3-input w3-border" type="text" v-model="category.name" required>
                </p>
                <p>
                    <label class="w3-text-blue"><b>Description</b></label>
                    <input class="w3-input w3-border" type="text" v-model.number="category.description" required>
                </p>
    
                    <button class="w3-btn w3-blue">Submit</button>
                </p>
            </form>
        </div>
    `,
    mounted(){
        this.getcategories()
    }
}