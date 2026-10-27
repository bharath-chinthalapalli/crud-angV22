import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUser } from './add-user';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

describe('AddUser', () => {
  let component: AddUser;
  let fixture: ComponentFixture<AddUser>;
  let http: HttpTestingController;
  const dialogRef = { close: vi.fn() };

  beforeEach(async () => {
    dialogRef.close.mockClear();
    await TestBed.configureTestingModule({
      imports: [AddUser],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUser);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('does not save an incomplete form', () => {
    component.saveUser();
    http.expectNone('http://localhost:3000/users');
    expect(dialogRef.close).not.toHaveBeenCalled();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Location is required.');
    expect(fixture.nativeElement.textContent).toContain('Price is required');
  });

  it('rejects short names, invalid prices and whitespace-only fields', () => {
    component.userForm.setValue({ pname: 'Ab', pprice: 0, plocation: '   ', pdetails: '   ' });
    component.saveUser();
    expect(component.userForm.controls.pname.invalid).toBe(true);
    expect(component.userForm.controls.pprice.invalid).toBe(true);
    expect(component.userForm.controls.plocation.invalid).toBe(true);
    expect(component.userForm.controls.pdetails.invalid).toBe(true);
    http.expectNone('http://localhost:3000/users');
  });

  it('prefills an existing user and sends updates to its original string ID', () => {
    const user = { id: '6RkcQXZPURQ', pname: 'Test', pprice: 100, plocation: 'Hyderabad', pdetails: 'Example' };
    component.data = user;
    component.ngOnInit();
    expect(component.userForm.controls.pname.value).toBe('Test');
    component.userForm.patchValue({ pname: 'Updated' });
    component.saveUser();

    const request = http.expectOne('http://localhost:3000/users/6RkcQXZPURQ');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.pname).toBe('Updated');
    expect(dialogRef.close).not.toHaveBeenCalled();
    const updated = { ...user, pname: 'Updated' };
    request.flush(updated);
    expect(dialogRef.close).toHaveBeenCalledWith(updated);
  });

  it('posts form data once and closes with the saved user only after success', () => {
    const data = { pname: 'Test', pprice: 100, plocation: 'Hyderabad', pdetails: 'Example' };
    component.userForm.setValue(data);
    component.saveUser();
    component.saveUser();

    const request = http.expectOne('http://localhost:3000/users');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(data);
    expect(dialogRef.close).not.toHaveBeenCalled();

    const savedUser = { ...data, id: '6' };
    request.flush(savedUser);
    expect(dialogRef.close).toHaveBeenCalledWith(savedUser);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
