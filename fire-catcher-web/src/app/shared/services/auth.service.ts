import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {

  constructor(private router: Router) {}

  private isLoggedIn = false;

  async login(email: string, password: string) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      this.isLoggedIn = true;
      return true;
    } catch (error) {
      this.isLoggedIn = false;
      return false;
    }
  }

  sendPasswordResetEmail(email: string) {
    firebase.auth().sendPasswordResetEmail(email);
  }

  canActivate() {
    if (this.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/']);
    }
    return false;
  }
}
