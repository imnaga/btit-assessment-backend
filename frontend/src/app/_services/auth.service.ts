import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router,
    private http: HttpClient) { }

  isAuthenticated(): boolean {
    if (sessionStorage.getItem('token') !== null) {
      return true;
    }
    return false;
  }

  canAccess() {
    if (!this.isAuthenticated()) {
      //redirect to login
      this.router.navigate(['/login']);
    }
  }
  // canAuthenticate(){
  //   if (this.isAuthenticated()) {
  //     //redirect to dashboard
  //     this.router.navigate(['/dashboard']);
  //   }
  // }
  createuser(address: string, phone_number: string, qualification: string): Observable<any> {
    const data = {
      address: address,
      phone_number: phone_number,
      qualification: qualification
    }
    return this.http.post<any>('http://192.168.25.41:4000/api/createUserProfile', data, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      })
    })
  }

  register(firstname: string, lastname: string, email: string, password: string, age: any): Observable<any> {
    //send data to register api (firebase)
    return this.http.post<any>('http://192.168.25.41:4000/api/createUser',
      { firstname, lastname, email, password, age }
    );
  }

  storeToken(token: any) {
    sessionStorage.setItem('token', token);
  }

  login(email: string, password: string): Observable<any> {
    const post = {
      email: email,
      password: password
    }
    //send data to login api (firebase)
    return this.http.post<any>('http://192.168.25.41:4000/api/login', post, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
      })
    });
  }

  detail() {
    let token = sessionStorage.getItem('token');

    return this.http.post<any>(
      'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=[API_KEY]',
      { idToken: token }
    );
  }

  removeToken() {
    sessionStorage.removeItem('token');
  }
  getalluser(id: string): Observable<any[]> {
    return this.http.get<any[]>(`http://192.168.25.41:4000/api/getAllUsers/${id}`, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      })
    });
  }


}
