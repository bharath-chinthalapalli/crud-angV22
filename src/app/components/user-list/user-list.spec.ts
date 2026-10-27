import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserList } from './user-list';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

describe('UserList', () => {
  let component: UserList;
  let fixture: ComponentFixture<UserList>;
  let http: HttpTestingController;
  let closed: Subject<unknown>;

  beforeEach(async () => {
    closed = new Subject();
    await TestBed.configureTestingModule({
      imports: [UserList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => closed }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserList);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/users').flush([]);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('refreshes the displayed list after a user is saved', () => {
    const user = { id: '6', pname: 'Test', pprice: 100, plocation: 'Hyderabad', pdetails: 'Example' };
    component.addUser();
    closed.next(user);
    http.expectOne('http://localhost:3000/users').flush([user]);
    fixture.detectChanges();
    expect(component.allUsers()).toEqual([user]);
    expect(fixture.nativeElement.textContent).toContain('Test');
  });

  it('does not reload the list when cancelled', () => {
    component.addUser();
    closed.next(undefined);
    http.expectNone('http://localhost:3000/users');
  });

  it('deletes by the original ID, refreshes and renumbers the remaining rows', () => {
    const user = { id: '6RkcQXZPURQ', pname: 'Test', pprice: 100, plocation: 'Hyderabad', pdetails: 'Example' };
    const remaining = { ...user, id: 'otherId', pname: 'Remaining' };
    component.allUsers.set([user, remaining]);
    component.deleteUser(user.id);
    const request = http.expectOne('http://localhost:3000/users/6RkcQXZPURQ');
    expect(request.request.method).toBe('DELETE');
    request.flush({});
    http.expectOne('http://localhost:3000/users').flush([remaining]);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].querySelector('td').textContent.trim()).toBe('1');
    expect(rows[0].textContent).toContain('Remaining');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
