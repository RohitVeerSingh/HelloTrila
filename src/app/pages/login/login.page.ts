import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

loginform:FormGroup

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.loginform = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  ngOnInit() {
  }

  onSubmit() {  
    console.log('loginForm',this.loginform.value);
    if (this.loginform.invalid) return;
    // fake validate — pressing sign in validates the user (per requirement)
    // this.auth.login(this.loginform.value.username || 'user');
     this.router.navigate(['/home']);
  }

}
