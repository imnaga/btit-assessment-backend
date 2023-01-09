import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Route,ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formdata = {firstname:"",lastname:"",email:"",password:"",age:""};
  submit=false;
  errorMessage="";
  loading=false;
  message="";
  constructor(
    private auth:AuthService,
    private route:ActivatedRoute,
    private router:Router,
    ) { }

  ngOnInit(): void {
    //this.auth.canAuthenticate();
  }

  onSubmit(){

      this.loading=true;

      //call register service
      this.auth
      .register(this.formdata.firstname,this.formdata.lastname,this.formdata.email,this.formdata.password,this.formdata.age)
      .subscribe({
          next:result=>{
            var info=JSON.parse(JSON.stringify(result));
            console.log(info.data)
            if(info.status ==1){
              if(info.data.userprofile){
                console.log("redirect login page")
              }else{
                console.log("redirect landing page")
              }''
            }
            this.router.navigate(['/login']);
            
          },
          error:data=>{
            if (data.error.status==0) {
              this.message = data.error.message;
            }
          }
      })
      .add(()=>{
          this.loading =false;
          console.log('Register process completed!');


      })
  }

}
