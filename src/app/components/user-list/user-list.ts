import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Users } from '../../modals/Users';
import { MatDialog } from '@angular/material/dialog';
import { AddUser } from '../../shared/components/add-user/add-user';
import { AllUsers } from '../../services/all-users';
@Component({
  imports: [MatButtonModule],
  selector: 'app-user-list',
  styleUrl: './user-list.scss',
  templateUrl: './user-list.html',
})
export class UserList {
  allUsers = signal<Users[]>([]);
  showProgress = signal(false);
  private readonly _dialoge: MatDialog = inject(MatDialog);
  private readonly _userService = inject(AllUsers);

  ngOnInit(): void {
    this.getAllProperties();
  }

  getAllProperties(): void {
    this._userService.getListing().subscribe({
      next: (res: Users[]) => {
        this.allUsers.set(res);
      },
      error: (err) => {
        console.error('Users:', err);
      },
    });
  }

  addUser(user?: Users) {
    this._dialoge.open(AddUser, {
      width: '400px',
      disableClose: true,
      data: user ?? null,
    }).afterClosed().subscribe((newUser: Users | undefined) => {
      if (newUser) {
        this.getAllProperties();
      }
    });
  }

  deleteUser(id: string): void {
    this._userService.delete(id).subscribe({
      next: () => this.getAllProperties(),
      error: () => alert('Delete failed. Check that JSON Server is running.'),
    });
  }
}
