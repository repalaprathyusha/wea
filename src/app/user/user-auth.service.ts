import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
// import { User } from '@firebase/auth-types';

import { User } from '../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  user$: Observable<User | null>;
  user: User;

  constructor(private http: HttpClient,
              private router: Router,
              public afAuth: AngularFireAuth,
              private snackBar: MatSnackBar) {
                this.user$ = this.afAuth.authState;
                this.afAuth.authState.subscribe(user => {
                  if (user) {
                    this.user = user;
                    localStorage.setItem('user', JSON.stringify(this.user));
                  } else {
                    localStorage.setItem('user', null);
                  }
                })
              }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.snackBar.open(`You've Signed Out`, 'OK', {
        duration: 5000
      });
      this.router.navigate(['/home']);
    })
  }

  private handleError(res: HttpErrorResponse) {
    console.log(res);
    return throwError(res.error || 'server eroor' );
  }

  get isLoggedIn(): boolean {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user  !==  null;
}
}
