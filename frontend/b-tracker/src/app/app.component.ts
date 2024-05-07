import { Component } from '@angular/core';
import { AuthService } from './services/auth-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'b-tracker';
tokenpopup:boolean=false;

  constructor(private authService:AuthService,private http:HttpClient){}
  ngOnInit(): void {
    setInterval(() => {
      const token = this.authService.getToken();
      if (token) {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000;
        const currentTime = Date.now();
        if (expirationTime - currentTime < 20000) { 
          this.tokenpopup = true;
          if(expirationTime - currentTime <=0){
            this.authService.logout()
            this.tokenpopup = false;
            this.authService.logout()
          }
        }
      }
    }, 1000);
  }

  refreshToken(){
    this.tokenpopup=false;
    this.authService.refreshToken();
  }

  logOut(){
    this.tokenpopup=false;
this.authService.logout();
  }
}
