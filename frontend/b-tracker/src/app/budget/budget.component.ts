import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstant } from '../app.constants';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  providers: [DatePipe]
})
export class BudgetComponent implements OnInit {
  budgets: any[] = [];
  newBudgetForm: FormGroup; // Define the reactive form group
  categories: any[] = [];
  showForm: boolean = false;
  display: boolean = false;
  months: string[]=[];
  newBudget:any={};

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const monthName = this.datePipe.transform(new Date(currentDate.getFullYear(), i), 'MMMM') || '';
      this.months.push(monthName);
    };
    this.newBudgetForm = this.formBuilder.group({
      category: ['', Validators.required],
      budget: ['', Validators.required],
      month: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getBudgets();
  }
  

  addBudget() {
    this.showForm = true;
  }

  saveBudgets() {
    if (this.newBudgetForm.valid) { 
      const formData = this.newBudgetForm.value;
      this.http.post<any>(`${AppConstant.API_URL}/budget`, formData).subscribe(
        (data) => {
          this.budgets.push(data);
          this.showForm = false;
          this.newBudgetForm.reset();
        },
        (error) => {
          console.error('Error saving budget:', error);
        }
      );
    }
  }

  getCategories() {
    this.http.get<any[]>(`${AppConstant.API_URL}/categories`).subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  getBudgets() {
    this.http.get<any[]>(`${AppConstant.API_URL}/budget`).subscribe(
      (data) => {
        this.budgets=data;
      },
      (error) => {
        console.error('Error fetching budgets:', error);
      }
    );
  }

  openEditDialog(rowData: any) {
   this.newBudget=rowData
    this.display = true;
  }

  updateBudget(newBudget: any) {
    this.http.put<any>(`${AppConstant.API_URL}/budget/${newBudget._id}`, newBudget, { withCredentials: true })
      .subscribe(
        (data) => {
          console.log('Expense updated successfully:', data);
          this.getBudgets();
        },
        (error) => {
          console.error('Error updating expense:', error);
        }
      );
    this.display = false;
  }

  deleteBudget(budgetId: number) {
    this.http.delete<any>(`${AppConstant.API_URL}/budget/${budgetId}`).subscribe(
      () => {
        this.budgets = this.budgets.filter(budget => budget._id !== budgetId);
      },
      (error) => {
        console.error('Error deleting expense:', error);
      }
    );
    this.display = false;
  }
}
