import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formdata = { email: "", password: "" };
  submit = false;
  loading = false;
  errorMessage = "";
  message = "";
  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    //this.auth.canAuthenticate();
  }

  onSubmit() {
    this.loading = true;
    //call login service
    this.auth.login(this.formdata.email, this.formdata.password)
      .subscribe((res: any) => {
        if (res.data.token) {
          console.log(res.data);
          sessionStorage.setItem('token', res.data.token);
          sessionStorage.setItem('userData', JSON.stringify(res.data))
          this.router.navigate(['/createuser']);
          if (res.status == 1) {
            if (res.data.userprofile) {
              console.log("redirect landing page")
            } else {
              console.log("redirect create profile")
            }
          }
        }
      })

      


}
}
