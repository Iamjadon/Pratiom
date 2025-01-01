import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: any = {
    EmailId: '',
    Password: '',
  };
  http = inject(HttpClient);
  onLogin() {
    // debugger;
    // this.http
    //   .post(
    //     'https://freeapi.miniprojectideas.com/api/User/Login',
    //     this.loginObj
    //   )
    //   .subscribe((res: any) => {
    //     if (res.result) {
    //       alert('Login Success');
    //     } else {
    //       alert(res.message);
    //     }
    //   });
    // onLogin() {
    // CORS Proxy URL prepended to avoid CORS issues.
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'https://freeapi.miniprojectideas.com/api/User/Login';

    this.http
      .post(
        corsProxy + apiUrl, // Use the CORS proxy
        this.loginObj
      )
      .subscribe((res: any) => {
        if (res.result) {
          alert('Login Success');
        } else {
          alert(res.message);
        }
      });
  }
}
// }
