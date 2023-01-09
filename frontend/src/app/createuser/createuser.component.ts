import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute,Router } from '@angular/router';
@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})
export class CreateuserComponent implements OnInit {

  

  formdata = {address:"",phone_number:"",qualification:"",};
  submit=false;
  errorMessage="";
  loading=false;

  constructor(
    private auth:AuthService,
    private route:ActivatedRoute,
    private router:Router,
    ) { }

  ngOnInit(): void {
    //this.auth.canAuthenticate();
  }

  onSubmit(){
    this.auth
    .createuser(this.formdata.address,this.formdata.phone_number,this.formdata.qualification)
    .subscribe({
         next:data=>{
          this.auth.storeToken(data.idToken);
          //this.router.navigate(['/createuser/login']);
          this.router.navigate(['/userlist']);
         },
    })
    .add(()=>{
      console.log('create user profile completed!');
    })
  }

      

}
