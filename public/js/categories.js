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
            <caption class="w3-text-grey" style="caption-side: top;">List of Categories</caption>
            <thead>
                <tr class="w3-teal">
                    <th scope="col">Category Name</th>
                    <th scope="col">Description</th>              
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in categories" :key="category.category_id">
                    <td>{{ category.name }}</td>
                    <td>{{ category.description }}</td>  
                </tr>
                <tr v-if="categories.length === 0">
                    <td colspan="2">No categories available</td>
                </tr>
            </tbody>
        </table>

        <div class="w3-container form-container ">
            <h2>Add Category</h2>
            <form @submit.prevent="addcategory" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin w3-padding" aria-label="Add Category Form">
                <p>
                    <label for="categoryName" class="w3-text-blue"><b>Category Name</b></label>
                    <input id="categoryName" class="w3-input w3-border" type="text" v-model="category.name" required>
                </p>
                <p>
                    <label for="categoryDescription" class="w3-text-blue"><b>Description</b></label>
                    <input id="categoryDescription" class="w3-input w3-border" type="text" v-model="category.description" required>
                </p>
                <p>
                    <button class="w3-btn w3-blue">Submit</button>
                </p>
            </form>
        </div>

    `,
    mounted(){
        this.getcategories()
    }
}