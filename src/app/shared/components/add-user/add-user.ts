import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AllUsers } from '../../../services/all-users';
import { Users } from '../../../modals/Users';

@Component({
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule],
  selector: 'app-add-user',
  styleUrl: './add-user.scss',
  templateUrl: './add-user.html',
})
export class AddUser {
  //1.declare and dependency injection : fb, service, dailogReference, data, boolean
  private _fb = inject(FormBuilder);
  private _userService = inject(AllUsers);
  private _dialogReference = inject(MatDialogRef<AddUser>);
  public data = inject<Users | null>(MAT_DIALOG_DATA);
  saving = signal(false);

  userForm = this._fb.group({
    pname: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z]+( [a-zA-Z]+)*$/)]],
    pprice: [0, [Validators.required, Validators.min(1)]],
    plocation: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+( [a-zA-Z]+)*$/)]],
    pdetails: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  ngOnInit(): void {
    if (this.data) {
      this.userForm.patchValue(this.data);
    }
    console.log(this.data)
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = {
      pname: this.userForm.controls.pname.value || '',
      pprice: this.userForm.controls.pprice.value || 0,
      plocation: this.userForm.controls.plocation.value || '',
      pdetails: this.userForm.controls.pdetails.value || '',
    };

    if (this.data) {
      // Existing user ni update cheyyadam
      this._userService.update(formData, this.data.id).subscribe({
        next: (res) => {
          this._dialogReference.close(res);
        },
        error: () => {
          alert('Update failed');
        },
      });
    } else {
      // New user ni add cheyyadam
      this._userService.addListing(formData).subscribe({
        next: (res) => {
          this._dialogReference.close(res);
        },
        error: () => {
          alert('Add failed');
        },
      });
    }
  }
}
