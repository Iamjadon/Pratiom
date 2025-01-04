import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { LoginRequest } from '../../models/login.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  
  loginObj: LoginRequest = {
    username: '',
    password: ''
  };

  constructor(private apiService: ApiService, private router: Router) {}

  onLogin() {
    this.apiService.loginUser(this.loginObj)
      .subscribe({
        next: (res) => {
          alert('Login successful');
          this.router.navigateByUrl('dashboard');
        },
        error: () => {
          alert('Wrong Credentials');
        }
      });
  }
}
