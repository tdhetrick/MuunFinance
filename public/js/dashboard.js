//const ChartModule = import('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js');

export default  {   
    data() {
        return {
            budgetTotals:[]
            
        };
    },
    methods: {
  
        getBudgetTable() {
            ajx.get('/budget_totals', this.user)
                .then(response => {
                    this.budgetTotals = response.data
                    this.createBudgetHChart();
                })
                .catch(error => {
                    handleResponseError(error)              
                });
        },
        async createBudgetHChart() {
            
      
            const ctx = document.getElementById('budget_percent').getContext('2d');
            const data = this.budgetTotals.map(item => ({
              label: item.category,
              percentage: (item.total_spent / item.budget_goal) * 100
            }));

            console.log(data)
      
            this.chart = new Chart(ctx, {
              type: 'bar',  // In Chart.js v3, use 'bar' instead of 'horizontalBar'
              data: {
                labels: data.map(item => item.label),
                datasets: [{
                  label: 'Percent of Budget Used',
                  data: data.map(item => item.percentage),
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: false,  // Disable responsiveness
                maintainAspectRatio: false, 
                indexAxis: 'y',  // For horizontal bar chart in Chart.js v3
                scales: {
                  x: {
                    beginAtZero: true,
                    //max: 100  // Assuming the percentage won't exceed 100%
                  }
                }
              }
            });
          }
    },
    template: `

    
    <canvas id="budget_percent" width="800" height="400"></canvas>

    <h2>Dashboard</h2>
    <table class="w3-table w3-bordered w3-striped table-mid-container">
        <thead>
            <tr class="w3-teal">
                <th>Categoty</th>
                <th>Goal</th>
                <th>Spent</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="bud in budgetTotals" :key="bud.budget_id">
                <td>{{ bud.category }}</td>
                <td>{{ bud.budget_goal }}</td>
                <td>{{ bud.total_spent }}</td>
            </tr>
        </tbody>
    </table>
    `,
    mounted(){
        this.getBudgetTable();
        
    }
}