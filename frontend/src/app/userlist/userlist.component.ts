import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  getalluser: any = [];
  formdata = { id: "", Firstname: "" };

  constructor(private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    //this.getalluser = this.route.data.snapshot
  }

  ngOnInit(): void {
    const data: any = sessionStorage.getItem('userData');
    const userdata = JSON.parse(data);
    console.log('data', data);
    this.auth.getalluser(userdata.id).subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.getalluser = data;
      }
    })
  }

}
