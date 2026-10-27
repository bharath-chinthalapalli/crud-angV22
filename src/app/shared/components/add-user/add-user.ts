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
  private fb = inject(FormBuilder);
  private _userService = inject(AllUsers);
  private dialogRef = inject(MatDialogRef<AddUser>);
  data = inject<Users | null>(MAT_DIALOG_DATA);

  saving = signal(false);

  userForm = this.fb.nonNullable.group({
    pname: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/\S/)]],
    pprice: [0, [Validators.required, Validators.min(1)]],
    plocation: ['', [Validators.required, Validators.pattern(/\S/)]],
    pdetails: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  ngOnInit(): void {
    if (this.data) {
      this.userForm.patchValue(this.data);
    }
  }

saveUser() {
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    return;
  }

  const formData = this.userForm.getRawValue();

  if (this.data) {
    // Existing user ni update cheyyadam
    this._userService.update(formData, this.data.id).subscribe({
      next: (res) => {
        this.dialogRef.close(res);
      },
      error: () => {
        alert('Update failed');
      }
    });
  } else {
    // New user ni add cheyyadam
    this._userService.addListing(formData).subscribe({
      next: (res) => {
        this.dialogRef.close(res);
      },
      error: () => {
        alert('Add failed');
      }
    });
  }
}
}
