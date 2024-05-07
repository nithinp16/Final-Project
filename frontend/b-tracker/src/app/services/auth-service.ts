import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConstant } from '../app.constants';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: BehaviorSubject<string | null>;
  public isLoggedin: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.token = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${AppConstant.API_URL}/login`, { username, password }).pipe(
      tap(response => {this.isLoggedin=true;
        this.storeToken(response.token)})
    );
  }

  signUp(user:any){
this.http.post(`${AppConstant.API_URL}/signup`, user)
.subscribe(
  (user: any) => {
    localStorage.setItem('user', user.user);
    this.isLoggedin=true;
    this.router.navigate(['/login']);
  },
  (error) => {
    console.log(error);
  }
);
  }

  refreshToken(){
    const token = localStorage.getItem("token");
    const username=localStorage.getItem("username")
    if (token && username) {  
     
      this.http.post("http://localhost:3000/refreshToken", { token, username }).subscribe(
        (response:any) => {
            console.log(response)
            localStorage.setItem('token', response.token);
            this.token.next(response.token)
        },(error)=>console.log(error));
    } 
  }

  logout() {
    this.isLoggedin=false;
    localStorage.clear();
    this.token.next(null);
    this.router.navigate(['/login'])
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
    this.token.next(token);
  }


  getToken(): string | null {
    return this.token.value;
  }

  checkTokenExpiration(): Observable<boolean> {
    const token = this.getToken();
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;
      const currentTime = Date.now();
      if (expirationTime - currentTime < 20000) {
        return of(true); 
      } else if (expirationTime - currentTime <= 0) {
        localStorage.removeItem('token');
    this.token.next(null);
    this.router.navigate(['/login']);
        return of(false);
      }
    }
    return of(false);
  }
}