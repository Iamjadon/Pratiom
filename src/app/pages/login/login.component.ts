import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/login.model';
import { ApiService } from '../../services/api-service';

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
  imageList: string[] = [
    '/images/loginImages.jpg',
    'assets/images/login.png', 
  ];
  

  constructor(private apiService: ApiService, private router: Router) {}

  onLogin() {
    this.apiService.loginUser(this.loginObj)
      .subscribe({
        next: (res) => {
          alert('Login successful');
          this.router.navigateByUrl('home/dashboard');
        },
        error: () => {
          alert('Wrong Credentials');
        }
      });
  }
}
