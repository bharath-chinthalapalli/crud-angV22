import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '../../services/auth';
import { CustomDirective } from '../../directives/custom-directive';
import { CustomPipePipe } from '../../shared/components/add-user/pipes/custom-pipe-pipe';
import { DiscountPipe } from '../../shared/components/add-user/pipes/discount-pipe';
import { ShortTextPipe } from '../../shared/components/add-user/pipes/short-text-pipe';
import { NameTitlePipe } from '../../shared/components/add-user/pipes/name-title-pipe';
import { ResultPipe } from '../../shared/components/add-user/pipes/result-pipe';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule, MatSnackBarModule, CustomDirective,
    CustomPipePipe, DiscountPipe, ShortTextPipe, NameTitlePipe, ResultPipe,
  ],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  // Fixed sample date so the examples show the same output every time.
  sampleDate = '2026-10-27T14:30:45+05:30';
  sampleUser = { name: 'Bharath', city: 'Hyderabad' };
  fruits = ['Apple', 'Banana', 'Mango', 'Orange'];
  message$ = of('Hello from Observable');
  messageCount = 2;
  messageMap = { '=0': 'No messages', '=1': 'One message', other: '# messages' };
  status = 'approved';
  statusMap = { approved: 'Approved successfully', rejected: 'Request rejected', other: 'Waiting' };

  private _router = inject(Router);
  private _fb = inject(FormBuilder);
  private _auth = inject(Auth);
  private _snackBar = inject(MatSnackBar);

  loginForm = this._fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this._snackBar.open('Enter username and password', 'Close', { duration: 3000 });
      return;
    }

    const username = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;

    if (username === 'bharathkumar' && password === '1234') {
      this._auth.isLoggedIn = true;
      this._snackBar.open('Login successful', 'Close', { duration: 3000 });
      this._router.navigate(['/userList']);
    } else {
      this._auth.isLoggedIn = false;
      this._snackBar.open('Wrong username or password', 'Close', { duration: 3000 });
    }
  }
}
