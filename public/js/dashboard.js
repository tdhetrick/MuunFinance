//const ChartModule = import('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js');

export default {
    data() {
        return {
            budgetTotals: [],
            categoryTotals: [],
            monthlyTotals:[],

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
                    window.handleResponseError(error)
                });
        },
        getCategoryTable() {
            ajx.get('/category_totals', this.user)
                .then(response => {
                    this.categoryTotals = response.data
                    this.createPieChart();
                })
                .catch(error => {
                    window.handleResponseError(error)
                });
        },
        getMonthlyNet() {
            ajx.get('/monthly_net_income', this.user)
                .then(response => {
                    console.log(response.data)
                    this.monthlyTotals = response.data
                    this.createNetBarChart();
                })
                .catch(error => {
                    window.handleResponseError(error)
                });
        },
        createBudgetHChart() {

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
        },
        createPieChart() {
            const ctx = document.getElementById('category_pie').getContext('2d');

            this.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: this.categoryTotals.map(item => item.category),
                    datasets: [{
                        label: 'Total Spent per Category',
                        data: this.categoryTotals.map(item => item.total_spent),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false
                }

            });
        },
        createNetBarChart() {
            const ctx = document.getElementById('monthly_net').getContext('2d');


            this.chart = new Chart(ctx, {
                
                data: {
                    labels: this.monthlyTotals.map(item => item.date),
                    datasets: [
                        {
                            label: 'Net Income',
                            data: this.monthlyTotals.map(item => item.net),
                            borderWidth: 1,
                            type: 'line',
                        },
                        {
                            label: 'Credit',
                            data: this.monthlyTotals.map(item => item.credits),
                            borderWidth: 1,
                            type: 'bar',
                        },
                        {
                            label: 'Debit',
                            data: this.monthlyTotals.map(item => item.debits),
                            borderWidth: 1,
                            type: 'bar',
                        }
                ]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false
                }

            });
        }
    },
    template: `

    <div class="w3-row w3-margin-bottom"></div>
        <div class="w3-col m6 l6 w3-margin-top ">
            <div class=" ">
                <h2>Percent Budget Used</h2>
                <canvas id="budget_percent" width="600" height="400"></canvas>
            </div>
            <div class=" w3-margin-top">
                <h2>Net Income</h2>
                <canvas id="monthly_net" width="600" height="400"></canvas>
            </div>
        </div>
        <div class="w3-col m6 l6  w3-margin-top">
            <div class="">
                <h2>Category Spending</h2>
                <canvas id="category_pie" width="600" height="400"></canvas>
            </div>
        </div>
    </div>

    `,
    mounted() {
        this.getBudgetTable();
        this.getCategoryTable();
        this.getMonthlyNet();

    }
}