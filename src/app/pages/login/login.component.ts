import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { Component, EnvironmentInjector, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  
})
export class LoginComponent {
  loginObj: any = {
    username: '',
    password: ''
  }

  router: Router;
  http: HttpClient;

  constructor(private environmentInjector: EnvironmentInjector) {
    this.router = inject(Router);
    this.http = inject(HttpClient);
    this.environmentInjector.runInContext(() => {
      provideHttpClient(withFetch());
    });
  }

  onLogin() {
    this.http.post('https://localhost:7088/api/User/login', this.loginObj)
      .subscribe({
        next: (res: any) => {
          alert('Login successful');
          this.router.navigateByUrl('dashboard');
        },
        error: () => {
          alert('Wrong Credentials');
        }
      });
  }
}
