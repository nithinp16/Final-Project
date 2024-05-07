import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstant } from '../app.constants';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  providers: [MessageService,DatePipe]
})
export class ExpenseComponent implements OnInit {
  expenses: any[] = [];
  newExpenseForm: FormGroup;
  categories: any[] = [];
  showForm: boolean = false;
  display: boolean = false;
  months: string[]=[]; 
  newExpense:any={};

  constructor(private http: HttpClient,
    private formBuilder: FormBuilder, private messageService: MessageService,private datePipe: DatePipe) {
      const currentDate = new Date();
      for (let i = 0; i < 12; i++) {
        const monthName = this.datePipe.transform(new Date(currentDate.getFullYear(), i), 'MMMM') || '';
        this.months.push(monthName);
      };
      this.newExpenseForm = this.formBuilder.group({
        category: ['', Validators.required],
        expense: ['', Validators.required],
        month: ['', Validators.required]
      });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getExpenses();
  }


  addExpense() {
    this.showForm = true;
  }

  saveExpense() {
    if (this.newExpenseForm.valid) { 
      const formData = this.newExpenseForm.value;
    this.http.post<any>(`${AppConstant.API_URL}/expense`, formData).subscribe(
      (data) => {
        this.expenses.push(data);
        this.showForm = false;
        this.newExpenseForm.reset();
        this.messageService.add({severity:'success', summary:'Success', detail:'Expense added successfully'});
      },
      (error) => {
        console.error('Error saving expense:', error);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to add expense'});
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

  getExpenses() {
    this.http.get<any[]>(`${AppConstant.API_URL}/expense`).subscribe(
      (data) => {
        this.expenses = data;
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  openEditDialog(rowData: any) {
    this.newExpense = rowData;
    this.display = true;

}
updateExpense(newExpense:any){
  this.http.put<any>(`${AppConstant.API_URL}/expense/${newExpense._id}`, newExpense, { withCredentials: true })
  .subscribe(
    (data) => {
      console.log('Expense updated successfully:', data);
      this.getExpenses();
    },
    (error) => {
      console.error('Error updating expense:', error);
    }
  );
  this.display=false;
}
deleteExpense(expenseId: number) {
    this.http.delete<any>(`${AppConstant.API_URL}/expense/${expenseId}`).subscribe(
        () => {
            this.expenses = this.expenses.filter(expense => expense._id !== expenseId);
            this.messageService.add({severity:'success', summary:'Success', detail:'Expense deleted successfully'});
        },
        (error) => {
            console.error('Error deleting expense:', error);
            this.messageService.add({severity:'error', summary:'Error', detail:'Failed to delete expense'});
        }
    );
    this.display=false;
}

}
