import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../services/auth';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('allows the correct username and password', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    vi.spyOn(fixture.debugElement.injector.get(MatSnackBar), 'open');
    component.loginForm.setValue({ username: 'bharathkumar', password: '1234' });

    component.login();

    expect(TestBed.inject(Auth).isLoggedIn).toBe(true);
    expect(navigate).toHaveBeenCalledWith(['/userList']);
  });

  it('rejects incorrect credentials', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const snackBar = vi.spyOn(fixture.debugElement.injector.get(MatSnackBar), 'open');
    component.loginForm.setValue({ username: 'bharathkumar', password: 'wrong' });

    component.login();

    expect(TestBed.inject(Auth).isLoggedIn).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    expect(snackBar).toHaveBeenCalledWith('Wrong username or password', 'Close', { duration: 3000 });
  });

  it('rejects empty fields', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    vi.spyOn(fixture.debugElement.injector.get(MatSnackBar), 'open');

    component.login();

    expect(TestBed.inject(Auth).isLoggedIn).toBe(false);
    expect(component.loginForm.touched).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });
});
