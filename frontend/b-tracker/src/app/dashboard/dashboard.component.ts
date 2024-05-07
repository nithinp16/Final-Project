import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppConstant } from '../app.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  basicData: any = {
    labels: [],
    datasets: []
  };
  monthlyData: any = {
    labels: [],
    datasets: []
  };
  piedata: any = {
    labels: [],
    datasets: []
  };
  budgets: any[] = [];
  expenses: any[] = [];
  labels: any[] = [];
  chartData: any[] = [];
  background: any[] = [];
  monthlyExpenseData: { [key: string]: { [key: string]: number } } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBudgetsAndPieChart();
    this.getMonthlyExpensesChart();
  }

  getMonthlyExpensesChart() {
    this.http.get<any>(`${AppConstant.API_URL}/expense/monthly`, { withCredentials: true }).subscribe(
      (data) => {
        console.log(data)
        this.monthlyExpenseData = data;
        this.formatMonthlyExpensesData();
      },
      (error) => {
        console.error('Error fetching monthly expense data:', error);
      }
    );
  }

  formatMonthlyExpensesData() {
    const formattedMonths = Object.keys(this.monthlyExpenseData);
    const categories = new Set<string>();
  
    // Gather all unique categories across all months
    for (const month of formattedMonths) {
      const monthCategories = Object.keys(this.monthlyExpenseData[month]);
      monthCategories.forEach(category => categories.add(category));
    }
  
    this.monthlyData = {
      labels: formattedMonths,
      datasets: Array.from(categories).map(category => {
        return {
          label: category,
          data: formattedMonths.map(month => this.monthlyExpenseData[month][category] || 0),
          backgroundColor: this.getRandomColor(),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        };
      }),
    };
  }

  getBudgetsAndPieChart() {
    this.http.get<any[]>(`${AppConstant.API_URL}/budget`, { withCredentials: true }).subscribe(
      (budgetData) => {
        this.budgets = budgetData;      
        this.fetchExpenses();
      },
      (error) => {
        console.error('Error fetching budgets:', error);
      }
    );
  }

  fetchExpenses() {
    this.http.get<any[]>(`${AppConstant.API_URL}/expense`, { withCredentials: true }).subscribe(
      (expenseData) => {
        this.expenses = expenseData;
        this.generateChartData();
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  generateChartData() {
    const allLabelsSet = new Set([...this.budgets.map(budget => budget.category), ...this.expenses.map(expense => expense.category)]);
    this.labels = Array.from(allLabelsSet);

    this.chartData = [];
    this.background = [];

    this.piedata = {
        labels: this.labels,
        datasets: [
            {
                data: this.budgets.map(budget => budget.budget),
                backgroundColor: this.budgets.map(() => this.getRandomColor())
            }
        ]
    };

    const groupedExpenseData: { [key: string]: number } = {};
    this.expenses.forEach((expense) => {
        if (groupedExpenseData[expense.category] === undefined) {
            groupedExpenseData[expense.category] = 0;
        }
        groupedExpenseData[expense.category] += expense.expense;
    });

    this.labels.forEach((label) => {
        this.chartData.push(groupedExpenseData[label] || 0);
        this.background.push(this.getRandomColor());
    });

    const expenseData = this.labels.map((budgetLabel) => groupedExpenseData[budgetLabel] || 0);
    this.basicData = {
        labels: this.labels,
        datasets: [
            {
                label: 'Budget',
                data: this.budgets.map(budget => budget.budget),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
            },
            {
                label: 'Expenses',
                data: expenseData,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                barPercentage: 1,
            },
        ],
    };
}


  private getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
}
