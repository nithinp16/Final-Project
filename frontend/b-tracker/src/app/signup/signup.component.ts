import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstant } from '../app.constants';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  SignUpForm: FormGroup;
  constructor(private authService:AuthService) {
    this.SignUpForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    let user = this.SignUpForm.getRawValue();

    if (this.SignUpForm.valid) {

     this.authService.signUp(user)
    }
  }
  _v() {
    return this.SignUpForm.value;
  }
}
